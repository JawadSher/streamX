import { NextRequest, NextResponse } from "next/server";
import { auth as authFn } from "@/app/api/auth/[...nextauth]/configs";

export async function middleware(request: NextRequest) {
  const session = await (authFn as any)(request);
  const { pathname } = request.nextUrl;

  if (session?.user && (pathname === "/sign-in")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [],
};
