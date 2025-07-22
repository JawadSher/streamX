import { NextRequest } from "next/server";

export async function getClientIP(req: NextRequest): Promise<string> {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp;
  }
  return "unknown";
}
