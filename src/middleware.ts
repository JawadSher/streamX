import { NextRequest } from "next/server";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";

export async function middleware(request: NextRequest) {

  const arcjetResponse = await arcjetMiddleware(request);
  if (arcjetResponse) return arcjetResponse;

  const authResponse = await authMiddleware(request);
  if (authResponse) return authResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};
