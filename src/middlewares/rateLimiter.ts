import rateLimit from "express-rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/ApiError";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, 
  keyGenerator: (req: NextRequest) => {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const vercelForwardedFor = req.headers.get("x-vercel-forwarded-for");
    const userId = req.headers.get("x-user-id");
    
    if (userId) return userId;
    if (forwardedFor) return forwardedFor.split(",")[0].trim();
    if (vercelForwardedFor) return vercelForwardedFor;
    return "anonymous";
  },
  handler: (req, res, next, options) => {
    return NextResponse.json(
      new ApiError("Too many requests, please try again later", 429),
      { status: 429 }
    );
  },
  skip: (req: NextRequest) => {
    return false; 
  },
});

export function rateLimitMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    return new Promise<NextResponse>((resolve, reject) => {
      apiRateLimiter(req as any, {} as any, (err: Error) => {
        if (err) {
          resolve(
            NextResponse.json(
              new ApiError("Too many requests, please try again later", 429),
              { status: 429 }
            )
          );
        } else {
          resolve(handler(req));
        }
      });
    });
  };
}