import { signOut } from "@/app/api/auth/[...nextauth]/configs";
import { connectRedis } from "@/lib/redis";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token && token._id) {
    try {
      const redis = await connectRedis();
      const userKeys = await redis.keys(`user:*${token._id}*`);
      for (const key of userKeys) {
        await redis.del(key);
      }
    } catch (error) {
      console.error("Error deleting user data from redis: ", error);
    }
  }

  await signOut();
  return NextResponse.redirect(new URL("/sign-in", req.url));
}
