import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
import { connectDB } from "@/lib/database";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import UserModel from "@/models/user.model";
import loginSchema from "@/schemas/loginSchema";
import { ZodError } from "zod";
import * as bcrypt from "bcryptjs";
import { Kafka } from "kafkajs";
import { connectRedis } from "@/lib/redis";
import { RedisAdapter } from "@/lib/redisAdapter";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [`${process.env.KAFKA_BROKER_IP}:${process.env.KAFKA_BROKER_PORT}`],
});

export async function cachedUserData(userId: string) {
  const user = await UserModel.findById(userId);
  if(!user) return;

  try {
    if (user) {
      const userData = {
        id: user._id.toString(), 
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        channelName: user.channelName,
        bio: user.bio,
        watchHistory: user.watchHistory,
      };
      const redis = await connectRedis();
      await redis.hset(`app:user:${userId}`, userData); 
      await redis.expire(`app:user:${userId}`, 86400);
    }
  } catch (error) {
      console.error("Failed to cache the user data: ", error);
  }
}

export async function initAuthConfigs() {
  let redisClient;

  try {
    redisClient = await connectRedis();
  } catch (error) {
    console.error("Redis Connection failed: ", error);
    throw new Error("Failed to initalize authentication system");
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
          if(!credentials?.email || !credentials?.password) return null;

          let user = null;

          const userData = {
            email: credentials.email,
            password: credentials.password,
          };
          const { email, password } = await loginSchema.parseAsync(userData);

          try {
            await connectDB();

            user = await UserModel.findOne({ email });
            if (!user) {
              throw new Error("Invalid email or password");
            }

            const isPasswdCorrect = await user.isPasswordCorrect(password);
            if (!isPasswdCorrect) {
              throw new Error("Invalid email or password");
            }

            await cachedUserData(user._id.toString());

            return {
              _id: user._id.toString(),
              email: user.email,
              userName: user.userName,
              firstName: user.firstName,
              lastName: user.lastName,
              channelName: user.channelName,
              phoneNumber: user.phoneNumber,
              country: user.country,
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
        allowDangerousEmailAccountLinking: true,
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider === "google") {
          try {
            await connectDB();

            let existingUser = await UserModel.findOne({ email: user.email });
            if (existingUser) {
              const redis = await connectRedis();

              await redis.hset(`app:user:${existingUser._id}`, {
                id: existingUser._id.toString(),
                email: existingUser.email,
                userName: existingUser.userName,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                channelName: existingUser.channelName,
                isVerified: existingUser.isVerified,
                bio: existingUser.bio,
              });

              await redis.expire(`app:user:${existingUser._id}`, 86400);
              return true;
            }

            const hashPasswd = await bcrypt.hash(`streamX@${Date.now()}`, 10);
            const newUserData = new UserModel({
              firstName: profile?.given_name || "John",
              lastName: profile?.family_name || "Doe",
              userName: user.email?.split("@")[0],
              email: user.email,
              channelName: user.email?.split("@")[0] + "-Channel",
              isVerified: true,
              password: hashPasswd,
              bio: "Hay guys im new in the streamX community",
            });

            console.log("Sending to Kafka:", newUserData);

            const producer = kafka.producer();
            await producer.connect();
            await producer.send({
              topic: "sign-up",
              messages: [
                { key: "sign-up", value: JSON.stringify(newUserData) },
              ],
            });

            await producer.disconnect();

            // await newUser.save();
            user._id = newUserData._id.toString();
            return true;
          } catch (error) {
            console.error("Error sending to Kafka:", error);

            try {
              const hashPasswd = await bcrypt.hash(`streamX@${Date.now()}`, 10);
              const newUser = new UserModel({
                firstName: profile?.given_name || "John",
                lastName: profile?.family_name || "Doe",
                userName: user.email?.split("@")[0],
                email: user.email,
                channelName: user.email?.split("@")[0] + "-Channel",
                isVerified: true,
                password: hashPasswd,
                bio: "Hey guys I'm new in the streamX community",
              });

              await connectDB();
              await newUser.save();
              user._id = newUser._id.toString();
              return true;
            }catch(error){
              console.error("Database fallback error:", error);
              return false;
            }
          }
        } else if(user){
          try {
            const redis = await connectRedis();
          await redis.hset(`user:${user._id}`, {
            id: user._id,
            email: user.email,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            channelName: user.channelName,
            phoneNumber: user.phoneNumber,
            country: user.country,
            isVerified: user.isVerified,
          });
          await redis.expire(`app:user:${user._id}`, 86400);
          } catch (error) {
            console.error("Redis caching error in credentials flow:", error);
          }
        }
        return true;
      },

      async jwt({ token, user }: { token: JWT; user?: any }) {
        if (user) {
          token._id = user._id;
          token.email = user.email;
          token.userName = user.userName;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.channelName = user.channelName;
          token.phoneNumber = user.phoneNumber;
          token.country = user.country;
          token.isVerified = user.isVerified;
        }

        return token;
      },

      async session({ session, user, token }) {
        if (user) {
          session.user = {
            ...session.user,
            _id: user.id || user._id,
            email: user.email || "",
            userName: user.userName || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            channelName: user.channelName || "",
            phoneNumber: user.phoneNumber || "",
            country: user.country || "",
            isVerified: user.isVerified || false,
          };
        } else if (token) {
          session.user = {
            ...session.user,
            _id: token._id,
            email: token.email || "",
            userName: token.userName || "",
            firstName: token.firstName || "",
            lastName: token.lastName || "",
            channelName: token.channelName || "",
            phoneNumber: token.phoneNumber || "",
            country: token.country || "",
            isVerified: token.isVerified || false,
          };
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
    },
    secret: process.env.NEXTAUTH_SECRET,
  };

  return authConfigs;
}

const authConfigs = await initAuthConfigs();
export const { handlers, signIn, signOut, auth } = NextAuth(authConfigs);