import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
import { connectDB } from "@/lib/database";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import UserModel from "@/models/user.model";
import loginSchema from "@/schemas/loginSchema";

export const authConfigs: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<User | null> {
        const userData = {
          email: credentials.email,
          password: credentials.password
        }
        const parsedData = loginSchema.safeParse(userData);

        if (!parsedData.success) {
          const errorMessage = parsedData.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");
          throw new Error(`Validation failed: ${errorMessage}`);
        }

        const { email, password } = parsedData.data;
        const identifier = email;

        try {
          await connectDB();
          const user = await UserModel.findOne({ email: identifier });
          console.log(user);

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
        token._id = user._id.toString();
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

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.includes("/api/auth") && !url.includes("/callback")) {
        return url;
      }

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
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfigs);
