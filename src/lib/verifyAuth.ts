import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const SECRET = process.env.NEXTAUTH_SECRET;
const NODE_ENV = process.env.NODE_ENV;

export async function verifyAuth(req: NextRequest) {
  const token = await getToken({
    req, 
    secret: SECRET, 
    secureCookie: NODE_ENV === "production", });

  if (!token) return null;
  
  return token;
}
