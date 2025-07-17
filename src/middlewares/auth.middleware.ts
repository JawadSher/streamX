import { ROUTES } from "@/constants/ApiRoutes";
import { protectedPaths } from "@/constants/paths";
import { verifyAuth } from "@/lib/verifyAuth";
import { NextRequest, NextResponse } from "next/server";

export const authMiddleware = async (
  req: NextRequest
): Promise<NextResponse> => {
  try {
    const { pathname } = req.nextUrl;
    const token = await verifyAuth(req);
    const isAuthenticated = !!token;

    if (isAuthenticated && pathname === "/sign-in") {
      return NextResponse.redirect(new URL(ROUTES.PAGES_ROUTES.HOME, req.url));
    }

    if (!isAuthenticated && pathname === "/sign-up") return NextResponse.next();

    if (req.nextUrl.pathname === "/api/graphql" && req.method === "POST") {
      const token = await verifyAuth(req);
      if (!token && pathname === "/sign-up") {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }

    const isProtected = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (!isAuthenticated && isProtected) {
      return NextResponse.redirect(
        new URL(ROUTES.PAGES_ROUTES.SIGN_IN, req.url)
      );
    }

    return NextResponse.next();
  } catch (error: any) {
    console.error("Auth Error: ", error.message);
    return NextResponse.next();
  }
};
