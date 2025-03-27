import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
import { connectDB } from "@/lib/database";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import UserModel from "@/models/user.model";
import loginSchema from "@/schemas/loginSchema";
import { ZodError } from "zod";
import { Kafka } from "kafkajs";
import * as bcrypt from "bcryptjs";

export const kafka = new Kafka({
  clientId: "streamX",
  brokers: ["192.168.10.2:9092"],
})

export const authConfigs: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
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
        } catch (error: any) {
          if (error instanceof ZodError) {
            return null;
          }
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
          await connectDB();

          let existingUser = await UserModel.findOne({ email: user.email });
          if (existingUser) return true;

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
              messages: [{ key: "sign-up", value: JSON.stringify(newUserData) }],
            })
            
            await producer.disconnect();

            // await newUser.save();
            user._id = newUserData._id.toString();
            return true;
          
        } catch (error) {
          console.error("Error sending to Kafka:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: any;
      account?: any;
    }) {
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

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          ...session.user,
          _id: token._id,
          email: token.email,
          userName: token.userName,
          firstName: token.firstName,
          lastName: token.lastName,
          channelName: token.channelName,
          phoneNumber: token.phoneNumber,
          country: token.country,
          isVerified: token.isVerified,
        };
      }

      return session;
    },

    async redirect({url, baseUrl}) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
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
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfigs);
