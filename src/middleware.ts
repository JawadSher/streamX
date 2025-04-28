import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { API_ROUTES } from "./lib/api/ApiRoutes";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const isAuthenticated = !!token;

  if (isAuthenticated && pathname === "/sign-in") {
    return NextResponse.redirect(new URL(API_ROUTES.HOME, request.url));
  }

  if (
    !isAuthenticated &&
    (pathname.startsWith("/feed") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/account"))
  ) {
    return NextResponse.redirect(new URL(API_ROUTES.SIGN_IN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/feed/:path*",
    "/profile/:path*",
    "/sign-in",
    "/account",
    "/account/:path*",
  ],
};
