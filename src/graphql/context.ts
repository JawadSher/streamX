import { auth } from "@/app/api/auth/[...nextauth]/configs";
import { verifyAuth } from "@/lib/verifyAuth";
import { NextRequest } from "next/server";

export interface Context {
  req: NextRequest;
  user?: {
    _id: string;
    expires?: string | number;
    picture?: string | undefined | null;
    sub?: string;
    jti?: string;
    iat?: number | string;
  } | null;
}

export async function createContext(req: NextRequest): Promise<Context> {
  try {
    const session = await auth();

    if (session?.user?._id) {
      const { _id } = session.user;
      return {
        req,
        user: {
          _id,
          expires: session.expires,
        },
      };
    }

    const token = await verifyAuth(req);
    if (token?._id) {
      return {
        req,
        user: {
          _id: token._id,
          picture: token.picture,
          sub: token.sub,
          jti: token.jti,
          iat: token.iat,
          expires: token.exp,
        },
      };
    }

    return {
      req,
      user: null,
    };
  } catch (error: any) {
    console.error("createContext error:", error);
    return {
      req,
      user: null,
    };
  }
}
