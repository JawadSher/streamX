import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
import { connectDB } from "@/lib/database";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import UserModel from "@/models/user.model";
import loginSchema from "@/schemas/loginSchema";
import { connectRedis } from "@/lib/redis";

export const authConfigs: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        userName: { label: "User Name", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req: Request): Promise<User | null> {
        console.log(credentials, req);
        const redis = await connectRedis();
        
        const parsedData = loginSchema.safeParse(credentials);
        if (!parsedData.success) {
          const errorMessage = parsedData.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");
            throw new Error(`Validation failed: ${errorMessage}`);
          }

          const { email, password } = parsedData.data;
          const identifier = email;
          const ip = req?.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
          
          console.log(req.headers);

          const ipKey = `blocked_ip:${ip}`;
          const isIpBlocked = await redis.get(ipKey);
          if(isIpBlocked){
            throw new Error("Your IP is temprorily block due to suspicius activity");
          }

          const lockoutKey = `login_attemps:${identifier?.toLowerCase()}`;
          const isLocked = await redis.get(lockoutKey);
          if(isLocked){
            throw new Error("Account temporarily locked. Try again in 15 minutes")
          }

          const attemptKey = `login_attempt:${identifier?.toLowerCase()}`;
          const attempts = await redis.get(attemptKey);
          const attemptCount = attempts ? parseInt(attempts) : 0;
          if(attemptCount >= 3){
            await redis.set(lockoutKey, "locked", {EX: 15 * 60});
            throw new Error("Too many login attempts. Account locked for 15 minutes")
          }

          const ipAttemptKey = `ip_attempts:${ip}`;
          const ipAttempts = await redis.get(ipAttemptKey);
          const ipAttemptCount = ipAttempts ? parseInt(ipAttempts) : 0;
          
          if(ipAttemptCount >= 10){
            await redis.set(ipKey, "blocked", {EX: 60 * 60});
            throw new Error("IP blocked due to excessive login attempts");
          }
        try {
          connectDB();
          const user = await UserModel.findOne({email});
          if (!user) {
            await redis.incr(attemptKey);
            await redis.expire(attemptKey, 24 * 60 * 60);
            await redis.incr(ipAttemptKey);
            await redis.expire(ipAttemptKey, 24 * 60 * 60);

            throw new Error("Invalid credentials or User not found");
          }

          const isPasswdCorrect = await user.isPasswordCorrect(password);
          if (!isPasswdCorrect) {
            await redis.incr(attemptKey);
            await redis.expire(attemptKey, 24 * 60 * 60);
            await redis.incr(ipAttemptKey);
            await redis.expire(ipAttemptKey, 24 * 60 * 60);

            throw new Error("Invalid credentials");
          }

          await redis.del(attemptKey);
          await redis.del(ipAttemptKey);

          const profileKey = `profile:${user._id}`;
          await redis.hSet(profileKey, {
            email: user.email,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            channelName: user.channelName,
            phoneNumber: user.phoneNumber || "",
            country: user.country || "None",
            isVerified: user.isVerified.toString(),
          })
          
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
      const redis = await connectRedis();
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

        const sessionKey = `session:${token.jti || token.sub}`;
        await redis.hSet(sessionKey, {
          user_id: user._id,
          email: user.email,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

        await redis.expire(sessionKey, 30 * 25 * 60 * 60)
      }
      if (account?.provider === "google" && token.email) {
        
        console.log("Google account detected:", account);

        try {
          await connectDB();
          let user = await UserModel.findOne({ email: token.email });
          if (!user) {
            const nameParts = token.name?.split(" ");
            const firstName = nameParts?.[0] || "Unknown";
            const lastName = nameParts?.[1] || "User";
            const date = Date.now();
            const userName = `@${token.name
              ?.toLowerCase()
              .replace(/[.\s]/g, "")}${date}`;
            const channelName = token.name
              ? `${firstName}-Channel`
              : "Unknown Channel";
            const password = `streamX@${date}`;

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

            user = await UserModel.create(newUserData);
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
      const redis = await connectRedis();
      const sessionKey = `session: ${token.jti || token.sub}`;
      const redisSession = await redis.hGetAll(sessionKey);

      if (token?._id && redisSession.user_id) {
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
      }else {
        session.expires = new Date(0).toISOString();
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
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfigs);
