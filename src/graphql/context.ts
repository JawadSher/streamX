import { verifyAuth } from "@/lib/verifyAuth";
import { NextRequest } from "next/server";

export interface Context {
  req: NextRequest;
  user?: any;
}

export async function createContext(req: NextRequest): Promise<Context> {
  try {
    const user = await verifyAuth(req);
    return {
      req,
      user,
    };
  } catch (error: any) {
    return {
      req,
      user: null,
    };
  }
}
