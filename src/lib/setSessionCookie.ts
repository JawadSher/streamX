import { cookies } from "next/headers";

export async function setSessionCookie(sessionToken: string, expires: Date) {
    const cookieStore = cookies();
    
    (await cookieStore).set("next-auth.session-token", sessionToken, {
      httpOnly: true,
      path: "/",
      expires,
    });
  }