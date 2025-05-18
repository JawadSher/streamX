import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./lib/api/ApiRoutes";
import { verifyAuth } from "./lib/verifyAuth";

const protectedPaths = ["/feed", "/profile", "/account"];
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await verifyAuth(request);
  const isAuthenticated = !!token;

  if (isAuthenticated && pathname === "/sign-in") {
    return NextResponse.redirect(new URL(ROUTES.PAGES_ROUTES.HOME, request.url));
  }

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (
    !isAuthenticated &&
    isProtected
  ) {
    return NextResponse.redirect(new URL(ROUTES.PAGES_ROUTES.SIGN_IN, request.url));
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
