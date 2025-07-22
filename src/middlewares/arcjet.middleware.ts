import { arcJetConf } from "@/configs/arcjet.configs";
import { ApiError } from "@/lib/api/ApiError";
import { getClientIP } from "@/lib/getClientIP";
import { verifyAuth } from "@/lib/verifyAuth";
import { NextRequest, NextResponse } from "next/server";

export const arcjetMiddleware = async (req: NextRequest) => {
  const isDev =
    process.env.NODE_ENV === "development" ||
    req.headers.get("host")?.includes("localhost");

  if (isDev) {
    return null;
  }

  const token = await verifyAuth(req);
  const userId = token?._id;
  const fingerprint = userId ?? (await getClientIP(req));

  try {
    const decision = await arcJetConf.protect(req, {
      requested: 1,
      fingerprint,
      "user-agent": req.headers.get("user-agent") || "",
      referer: req.headers.get("referer") || "",
      "accept-language": req.headers.get("accept-language") || "",
      accept: req.headers.get("accept") || "",
      "sec-ch-ua": req.headers.get("sec-ch-ua") || "",
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return ApiError({
          statusCode: 429,
          message: "Rate limit exceeded. Please try again later.",
          success: false,
          code: "RATE_LIMITED_ERROR",
          data: { error: "Too Many Requests" },
          isGraphql: false,
        });
      } else if (decision.reason.isBot()) {
        return ApiError({
          statusCode: 403,
          message: "Automated requests are not allowed.",
          success: false,
          code: "BOT_DETECTED_ERROR",
          data: { error: "Bot Access Denied" },
          isGraphql: false,
        });
      } else {
        return ApiError({
          statusCode: 403,
          message: "Access denied by security policy.",
          success: false,
          code: "FORBIDDEN_ERROR",
          data: { error: "Forbidden" },
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
        data: { error: "Spoofed bot detected" },
        isGraphql: false,
      });
    }

    return NextResponse.next();
  } catch (error: any) {
    console.error("Arcjet Error:", error.message);
    return NextResponse.next();
  }
};
