"use server"

import { getUserFromRedis } from "@/lib/getUserFromRedis";

export default async function getUserData (userId: string) {
    const user = await getUserFromRedis(userId);

    console.log(user);

    if(!user) return null;

    return user;
}
