import { NextRequest, NextResponse } from "next/server";
import { auth as authFn } from "@/app/api/auth/[...nextauth]/configs";

export async function middleware(request: NextRequest) {

  const session = await (authFn as any)(request);
  const { pathname } = request.nextUrl;

  if (session.user && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in", 
    "/sign-up", 
    "/dashboard/:path*"
  ],
};