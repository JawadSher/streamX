import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
import { connectDB } from "@/lib/database";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import UserModel from "@/models/user.model";
import loginSchema from "@/schemas/loginSchema";
import * as bcrypt from "bcryptjs";
import { fetchUserFromMongoDB } from "@/lib/fetchUserFromMongoDB";
import { storeUserInRedis } from "@/lib/storeUserInRedis";
import notifyKakfa from "@/lib/notifyKafka";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";

export async function initAuthConfigs() {
  const authConfigs: NextAuthConfig = {
    providers: [
      Credentials({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
          const email = credentials?.email as string;
          const userInfo = await fetchUserFromMongoDB({ email });
          await storeUserInRedis(userInfo as IRedisDBUser);

          return {
            _id: userInfo._id.toString(),
          };
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

            const existingUser = await fetchUserFromMongoDB({
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
              userName: "@" + user.email?.split("@")[0].replace(".", ""),
              email: user.email,
              channelName: `${user.email?.split("@")[0]}-Channel`,
              isVerified: true,
              password: securePassword,
              bio: "Hey guys I'm new in the streamX community",
              avatar: user?.image,
              storageProvider: "google",
            };

            try {
              await notifyKakfa({ userData: newUserData, action: "sign-up" });
              await new Promise((resolve) => setTimeout(resolve, 1500));
            } catch (kafkaError) {
              console.warn(
                "Kafka failed, falling back to DB flow:",
                kafkaError
              );
            }

            let newUser = await fetchUserFromMongoDB({
              email: newUserData.email,
            });

            if (!newUser) {
              newUser = new UserModel({
                ...newUserData,
              });
              await newUser.save();
            }

            await storeUserInRedis(newUser);
            user._id = newUser._id.toString();
            return true;
          } catch (error) {
            console.error("Overall Google auth error:", error);
            return false;
          }
        }
        return true;
      },

      async jwt({ token, user }: { token: JWT; user?: User }) {
        if (user) {
          token._id = user._id;
        }
        return token;
      },

      async session({ session, token }: { session: Session; token: JWT }) {
        if (token) {
          session.user = {
            _id: token._id,
          };
        }
        return session;
      },

      async redirect({ url, baseUrl }) {
        if (url.includes("/sign-up")) return `${baseUrl}/`;
        if (url.includes("/sign-in")) return `${baseUrl}/`;
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
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
  };

  return authConfigs;
}

const authConfigs = await initAuthConfigs();
export const { handlers, signIn, signOut, auth } = NextAuth(authConfigs);
