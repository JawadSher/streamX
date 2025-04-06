import { cookies } from "next/headers";

export async function getSessionCookie(): Promise<string> {
    const cookieStore = cookies();
    return (await cookieStore).get("next-auth.session-token")?.value ?? "";
  }