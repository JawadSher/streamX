import { IRedisDBUser } from "@/interfaces/IRedisDBUser";

export function sanitizeUserData(user: IRedisDBUser): IRedisDBUser {
  return {
    ...user,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
  };
}
