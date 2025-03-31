import { signOut } from "@/app/api/auth/[...nextauth]/configs";
import { connectRedis } from "@/lib/redis";
import { getToken } from "next-auth/jwt";
import { getUserFromRedis } from "@/app/api/auth/[...nextauth]/configs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const redis = await connectRedis();

    const userData = await getUserFromRedis(token._id.toString());
    const email = userData?.email || token.email; 

    await redis.del(`app:user:${token._id}`);
    await redis.del(`user:session:by-user-id:${token._id}`);

    if (email) {
      await redis.del(`user:email:${email}`);
    }

    if (userData?.googleId) {
      await redis.del(`user:google:${userData.googleId}`);
    }

    await redis.del(`user:account:by-user-id:${token._id}`);
  } catch (error) {
    console.error("Error deleting user data from Redis: ", error);
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 }
    );
  }

  await signOut();
  return NextResponse.redirect(new URL("/sign-in", req.url));
}