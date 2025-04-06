import NextAuth, { NextAuthConfig } from "next-auth";
import { connectDB } from "@/lib/database";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import UserModel from "@/models/user.model";
import loginSchema from "@/schemas/loginSchema";
import * as bcrypt from "bcryptjs";
import { connectRedis } from "@/lib/redis";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { fetchUserFromMongoDB } from "@/lib/fetchUserFromMongoDB";
import { storeUserInRedis } from "@/lib/storeUserInRedis";
import { getUserFromRedis } from "@/lib/getUserFromRedis";
import notifyKakfa from "@/lib/notifyKafka";
import { v4 as randomUUID } from "uuid";
import { encode as defaultEncode, decode as defaultDecode, JWTEncodeParams, JWTDecodeParams  } from "next-auth/jwt";
import { setSessionCookie } from "@/lib/setSessionCookie";
import { getSessionCookie } from "@/lib/getSessionCookie";

interface CredentialsUser {
  _id: string;
  email: string;
  tokenType?: "credentials";
}
export async function initAuthConfigs() {
  let redisClient;
  try {
    redisClient = await connectRedis();
  } catch (error) {
    console.error("Redis Connection failed: ", error);
    throw new Error("Failed to initialize authentication system");
  }

  const authConfigs: NextAuthConfig = {
    adapter: UpstashRedisAdapter(redisClient),
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
          if (!credentials?.email || !credentials?.password) return null;
          const userData = {
            email: credentials.email,
            password: credentials.password,
          };

          try {
            const { email, password } = await loginSchema.parseAsync(userData);

            await connectDB();
            const existingUser = await UserModel.findOne({ email });

            if (!existingUser) {
              throw new Error("Invalid email or password");
            }

            const isPasswdCorrect = await existingUser.isPasswordCorrect(
              password
            );

            if (!isPasswdCorrect) {
              throw new Error("Invalid email or password");
            }

            return {
              _id: existingUser._id.toString(),
              email: existingUser.email,
              tokenType: "credentials"
            };
          } catch (error) {
            console.error("Authorization error: ", error);
            return null;
          }
        },
      }),
      GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider === "google") {
          try {
            if (!user || !user.email) {
              console.error("GOOGLE AUTH ERROR: User or email is missing");
              return false;
            }

            let existingUser = await fetchUserFromMongoDB({
              email: user.email,
            });

            if (existingUser) {
              await storeUserInRedis(existingUser);
              user._id = existingUser._id.toString();
              return true;
            }

            const securePassword = await bcrypt.hash(
              `${Math.random().toString(36).slice(2)}${Date.now()}`,
              10
            );

            const newUserData = {
              firstName: profile?.given_name || "",
              lastName: profile?.family_name || "",
              userName: user.email?.split("@")[0].replace(".", ""),
              email: user.email,
              channelName: `${user.email?.split("@")[0]}-Channel`,
              isVerified: true,
              password: securePassword,
              bio: "Hey guys I'm new in the streamX community",
              avatar: user?.image,
              storageProvider: "google",
            };

            try {
              await notifyKakfa(newUserData);
              await new Promise((resolve) => setTimeout(resolve, 1500));

              const newUser = await fetchUserFromMongoDB({
                email: newUserData.email,
              });

              if (!newUser) {
                throw new Error(
                  "User creation via Kafka appears to have failed"
                );
              }

              await storeUserInRedis(newUser);
              user._id = newUser._id.toString();
              return true;
            } catch (kafkaError) {
              console.error(
                "Error with Kafka flow, falling back to direct DB creation:",
                kafkaError
              );
              try {
                await connectDB();
                const newUser = new UserModel(newUserData);
                await newUser.save();

                const userInfo = await fetchUserFromMongoDB({
                  userId: newUser._id,
                });
                
                await storeUserInRedis(userInfo);
                user._id = newUser._id.toString();
                return true;
              } catch (dbError) {
                console.error("Direct DB user creation failed:", dbError);
                return false;
              }
            }
          } catch (overallError) {
            console.error("Overall Google auth error:", overallError);
            return false;
          }
        }

        if(account?.provider === "credentials" &&  (user as CredentialsUser)?.tokenType === "credentials"){
          try {
            const sessionToken = randomUUID();
            const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            const userId = user._id;
            const userInfo = await fetchUserFromMongoDB({ userId });
            await storeUserInRedis(userInfo);

            await redisClient.set(
              `user:session:${sessionToken}`,
              JSON.stringify({
                userId: user._id,
                expires: sessionExpiry.toISOString(),
              })
            );
            await setSessionCookie(sessionToken, sessionExpiry);
          } catch (error) {
              console.error("Error creating credentials session: ", error);
              return false;
          }
        }
        return true;
      },

      async jwt({ token, user }: { token: JWT; user?: any }) {
        if (user) {
          token._id = user._id;
          token.email = user.email;

          if (user.tokenType) {
            token.tokenType = user.tokenType;
          }

        }
        return token;
      },
      async session({ session, token }: { session: any; token: JWT }) {
        if (token) {
          session.user = {
            _id: token._id,
            email: token.email,
          };

          if (token._id) {
            const redisUser = await getUserFromRedis(token._id.toString());
            if (redisUser) {
              session.user = {
                ...session.user,
                userName: redisUser.userName || "",
                firstName: redisUser.firstName || "",
                lastName: redisUser.lastName || "",
                channelName: redisUser.channelName || "",
                bio: redisUser.bio || "",
                isVerified: redisUser.isVerified,
              };
            }
          }
        }
        return session;
      },
      async redirect({ url, baseUrl }) {
        if (url.includes("/sign-up")) return `${baseUrl}/`;
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        if (url.startsWith(baseUrl)) return url;
        return baseUrl;
      },
    },
    pages: {
      signIn: "/sign-in",
      error: "/sign-in",
    },
    session: {
      strategy: "database",
      maxAge: 30 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,

    jwt: {
      async encode(params: JWTEncodeParams): Promise<string> {
        const { token, secret, maxAge, salt } = params;
        if (token?.tokenType === "credentials") {
          const sessionToken = getSessionCookie();
          return sessionToken ?? "";
        }
        return await defaultEncode({
          token,
          secret,
          maxAge,
          salt: salt ?? process.env.JWT_SALT ?? "defaultSalt",
        });
      },
    
      async decode(params: JWTDecodeParams): Promise<JWT | null> {
        const { token, secret, salt } = params;
        if (token === "") return null;
        const decoded = await defaultDecode({
          token,
          secret,
          salt: salt ?? process.env.JWT_SALT ?? "defaultSalt",
        });
        return decoded;
      },
    },
  };

  return authConfigs;
}

const authConfigs = await initAuthConfigs();
export const { handlers, signIn, signOut, auth } = NextAuth(authConfigs);
