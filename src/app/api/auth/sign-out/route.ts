import { auth, signOut } from "@/app/api/auth/[...nextauth]/configs";
import { connectRedis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session || !session.user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const redis = await connectRedis();
    const mUserId = session?.user?._id.toString();
    const userId = session?.user?.id?.toString();
    const userEmail = session?.user.email;
  
    await redis.del(`app:user:${mUserId}`);
    await redis.del(`user:account:by-user-id:${userId}`);
    await redis.del(`user:email:${userEmail}`);
    await redis.del(`user:session:by-user-id:${userId}`);
    await redis.del(`user:${userId}`);
  
  }catch(error){
    console.error("Redis deletion session operation failed: ", error);
  }
  
  await signOut();
  return NextResponse.redirect(new URL("/sign-in", req.url));
}