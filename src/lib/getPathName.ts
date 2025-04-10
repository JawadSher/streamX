import { headers } from "next/headers";

export const getPathName = async () => {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const fullUrl = `${protocol}://${host}${headersList.get("x-url") || "/"}`;

    return new URL(fullUrl).pathname;
}

