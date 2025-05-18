import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { connectRedis } from "./redis";

export async function getUserFromRedis(
  userId: string
): Promise<IRedisDBUser | null> {
  if (!userId) return null;

  const fields = [
    "_id",
    "userName",
    "email",
    "firstName",
    "lastName",
    "accountStatus",
    "banner",
    "avatar",
    "isVerified",
    "bio",
    "country",
    "phoneNumber",
    "createdAt",
    "updatedAt",
  ] as const;

  try {
    const redis = await connectRedis();
    const rawValues = await redis.hmget(`app:user:${userId}`, ...fields);

    let values: (string | null)[];
    if (Array.isArray(rawValues)) {
      values = rawValues.map((val) =>
        val === null || typeof val === "string" ? val : null
      );
    } else if (rawValues && typeof rawValues === "object") {
      values = fields.map(
        (field) => (rawValues as Record<string, string | null>)[field] ?? null
      );
    } else {
      console.error(`Unexpected hmget response for user ${userId}:`, rawValues);
      return null;
    }

    if (values.every((val) => val === null)) return null;

    const userData = Object.fromEntries(
      fields.map((key, index) => [key, values[index] ?? ""])
    ) as Record<(typeof fields)[number], string>;

    const user: IRedisDBUser = {
      _id: userData._id,
      userName: userData.userName,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      accountStatus: userData.accountStatus,
      bannerURL: userData.banner,
      avatarURL: userData.avatar,
      isVerified: userData.isVerified,
      bio: userData.bio,
      country: userData.country,
      phoneNumber: userData.phoneNumber,
      createdAt: userData.createdAt ? new Date(userData.createdAt) : null,
      updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : null,
    };

    if (!user._id || !user.userName) return null;

    return user;
  } catch (error) {
    console.error(`Failed to fetch user ${userId} from Redis:`, error);
    return null;
  }
}
