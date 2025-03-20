import { signOut } from "@/app/api/auth/[...nextauth]/configs"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    await signOut();
    return NextResponse.redirect(new URL('/sign-in', req.url));
}