import { auth, signOut } from "@/app/api/auth/[...nextauth]/configs";
import { connectRedis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session || !session.user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const redis = await connectRedis();
    const userId = session?.user?._id.toString();
    await redis.del(`app:user:${userId}`);
  
  }catch(error){
    console.error("Redis deletion session operation failed: ", error);
  }
  
  await signOut();
  return NextResponse.redirect(new URL("/sign-in", request.url));
}