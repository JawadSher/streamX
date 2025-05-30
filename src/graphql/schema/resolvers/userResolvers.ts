import { queryType } from "nexus";
import { fetchUserFromMongoDB } from "@/lib/fetchUserFromMongoDB";
import { getUserFromRedis } from "@/lib/getUserFromRedis";
import { storeUserInRedis } from "@/lib/storeUserInRedis";
import { UserResponse } from "@/graphql/responseSchema";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";

export const UserQuery = queryType({
  definition(t) {
    t.field("getUser", {
      type: UserResponse,
      resolve: async (_parnt, _args, ctx) => {
        try {
          const { user: authUser } = ctx;

          if (!authUser) {
            throw ApiError({
              statusCode: 401,
              success: false,
              code: "UNAUTHORIZED",
              message: "Unauthorized request",
              data: null,
            });
          }

          const userId = authUser._id;
          let user = await getUserFromRedis(userId);

          if (!user) {
            user = await fetchUserFromMongoDB({ userId });
            if (user) await storeUserInRedis(user);
          }

          if (!user) {
            throw ApiError({
              statusCode: 404,
              success: false,
              code: "USER_NOT_FOUND",
              message: "User data not found",
              data: null,
            });
          }

          return ApiResponse({
            statusCode: 200,
            success: true,
            message: "User fetched successfully",
            data: {
              ...user,
              _id: user?._id?.toString(),
            },
          });
        } catch (error: any) {
          throw ApiError({
            statusCode: 400,
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message:
              error.message || "Something went wrong while fetching user data",
            data: null,
          });
        }
      },
    });
  },
});
