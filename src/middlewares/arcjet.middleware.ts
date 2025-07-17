import { arcJetConf } from "@/configs/arcjet.configs";
import { ApiError } from "@/lib/api/ApiError";
import { NextRequest, NextResponse } from "next/server";

export const arcjetMiddleware = async (req: NextRequest) => {
  const isDev =
    process.env.NODE_ENV === "development" ||
    req.headers.get("host")?.includes("localhost");

  if (isDev) {
    return null;
  }

  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  const email = req.nextUrl.searchParams.get("email") || "";

  try {
    const decision = await arcJetConf.protect(req, {
      requested: 1,
      email,
      "header.user-agent": userAgent,
      "header.referer": referer,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return ApiError({
          statusCode: 429,
          message: "Rate limit exceeded. Please try again later.",
          success: false,
          code: "RATE_LIMITED_ERROR",
          data: {
            error: "Too Many Requests",
          },
          isGraphql: false,
        });
      } else if (decision.reason.isBot()) {
        return ApiError({
          statusCode: 403,
          message: "Automated requests are not allowed.",
          success: false,
          code: "BOT_DETECTED_ERROR",
          data: {
            error: "Bot Access Denied",
          },
          isGraphql: false,
        });
      } else {
        return ApiError({
          statusCode: 403,
          message: "Access denied by security policy.",
          success: false,
          code: "FORBIDDEN_ERROR",
          data: {
            error: "Forbidden",
          },
          isGraphql: false,
        });
      }
    }

    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      return ApiError({
        statusCode: 403,
        message: "Malicious bot activity detected.",
        success: false,
        code: "SPOOFED_BOT_DETECTION_ERROR",
        data: {
          error: "Spoofed bot detected",
        },
        isGraphql: false,
      });
    }

    return NextResponse.next();
  } catch (error: any) {
    console.error("Arcjet Error: ", error.message);
    return NextResponse.next();
  }
};
