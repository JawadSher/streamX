import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./lib/api/ApiRoutes";
import { verifyAuth } from "./lib/verifyAuth";
import { tokenLimiter } from "./lib/tokenLimiter";

const protectedPaths = ["/feed", "/profile", "/account"];
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rateLimitResponse = await tokenLimiter(request, {
    maxTokens: 100,
    refillRate: 10,
  });

  if(rateLimitResponse) return rateLimitResponse;

  const token = await verifyAuth(request);
  const isAuthenticated = !!token;

  if (isAuthenticated && pathname === "/sign-in") {
    return NextResponse.redirect(
      new URL(ROUTES.PAGES_ROUTES.HOME, request.url)
    );
  }

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(
      new URL(ROUTES.PAGES_ROUTES.SIGN_IN, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/feed/:path*",
    "/profile/:path*",
    "/sign-in",
    "/account",
    "/account/:path*",
  ],
};
