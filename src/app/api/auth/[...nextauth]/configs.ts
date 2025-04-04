import NextAuth, { NextAuthConfig } from "next-auth";
import { connectDB } from "@/lib/database";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import UserModel from "@/models/user.model";
import loginSchema from "@/schemas/loginSchema";
import * as bcrypt from "bcryptjs";
import { Kafka } from "kafkajs";
import { connectRedis } from "@/lib/redis";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { fetchUserFromMongoDB } from "@/lib/fetchUserFromMongoDB";
import { storeUserInRedis } from "@/lib/storeUserInRedis";
import { getUserFromRedis } from "@/lib/getUserFromRedis";

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [`${process.env.KAFKA_BROKER_IP}:${process.env.KAFKA_BROKER_PORT}`],
});

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
            const user = await UserModel.findOne({ email });

            if (!user) {
              throw new Error("Invalid email or password");
            }

            const isPasswdCorrect = await user.isPasswordCorrect(password);
            if (!isPasswdCorrect) {
              throw new Error("Invalid email or password");
            }

            const userInfo = await fetchUserFromMongoDB({ email });
            await connectRedis();
            await storeUserInRedis(userInfo);

            return {
              _id: user._id.toString(),
              email: user.email,
              isVerified: user.isVerified,
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

            let existingUser = await fetchUserFromMongoDB({ email: user.email });

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
              console.log("Sending to Kafka:", newUserData);
              const producer = kafka.producer();
              await producer.connect();
              await producer.send({
                topic: "sign-up",
                messages: [
                  {
                    key: "sign-up",
                    value: JSON.stringify(newUserData),
                    headers: {
                      source: "google-auth",
                      timestamp: Date.now().toString(),
                    },
                  },
                ],
              });
              await producer.disconnect();

              await new Promise((resolve) => setTimeout(resolve, 1500));
              
              await connectDB();
              const newUser = await UserModel.findOne({
                email: newUserData.email,
              });

              if (!newUser) {
                throw new Error(
                  "User creation via Kafka appears to have failed"
                );
              }

              await connectRedis();
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
                await connectRedis();

                const userInfo = await fetchUserFromMongoDB({ userId: newUser._id });
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
        } else if (user && user._id) {
          const userId = user._id;
          const userInfo = await fetchUserFromMongoDB({ userId });
          if (userInfo) {
            await connectRedis();
            await storeUserInRedis(userInfo);
          }
        }
        return true;
      },
      async jwt({ token, user }: { token: JWT; user?: any }) {
        if (user) {
          token._id = user._id;
          token.email = user.email;
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
            await connectRedis();
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
  };

  return authConfigs;
}

const authConfigs = await initAuthConfigs();
export const { handlers, signIn, signOut, auth } = NextAuth(authConfigs);
