"use server"

import { getUserFromRedis } from "@/lib/getUserFromRedis";

export default async function getUserData (userId: string) {
    const user = await getUserFromRedis(userId);

    if(!user) return null;

    return user;
}
