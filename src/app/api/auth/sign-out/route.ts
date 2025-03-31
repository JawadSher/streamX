import { signOut } from "@/app/api/auth/[...nextauth]/configs"
import { connectRedis } from "@/lib/redis";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const token = await getToken({ req });
    if(token && token._id){
        try{
            const redis = await connectRedis();
            await redis.del(`app:user:${token._id}`);
        }catch(error){
            console.error("Error deleting user data from redis: ", error);
        }
    }

    await signOut();
    return NextResponse.redirect(new URL('/sign-in', req.url));
}