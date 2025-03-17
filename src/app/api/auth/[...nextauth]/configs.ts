import NextAuth, { NextAuthConfig, Session } from "next-auth";
import { connectDB } from "@/lib/database";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import User from "@/models/user.model";

export const authConfigs: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        userName: { label: "User Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await connectDB();
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.email },
              { userName: credentials.userName },
            ],
          });
          if (!user) {
            throw new Error("Invalid credentials or User not found");
          }
          const isPasswdCorrect = await user.isPasswordCorrect(
            credentials.password
          );
          if (!isPasswdCorrect) {
            throw new Error("Invalid credentials");
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
          console.error("Authorize error (Credentials):", error.message);
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
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
      if (account?.provider === "google" && token.email) {
        console.log("Google account detected:", account);
        try {
          await connectDB();
          let user = await User.findOne({ email: token.email });
          if (!user) {

            const nameParts = token.name?.split(" ");
            const firstName = nameParts?.[0] || "Unknown";
            const lastName = nameParts?.[1] || "User";
            const date = Date.now();
            const userName = `@${token.name?.toLowerCase().replace(/[.\s]/g, "")}${date}`;
            const channelName = token.name ? `${firstName}-Channel` : "Unknown Channel";
            const password = `streamX@${date}`

            const newUserData: any = {
              email: token.email,
              userName,
              firstName,
              lastName,
              channelName,
              isVerified: false,
              password,
              country: "None",
            };

            user = await User.create(newUserData);
          }

          token._id = user._id.toString();
          token.userName = user.userName;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.channelName = user.channelName;
          token.phoneNumber = user.phoneNumber;
          token.country = user.country;
          token.isVerified = user.isVerified;
        } catch (error: any) {
          console.error("Error in JWT callback:", error.message);
          throw new Error(error.message);
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?._id) {
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
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.includes("/api/auth/callback")) {
        return `${baseUrl}/`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfigs);
