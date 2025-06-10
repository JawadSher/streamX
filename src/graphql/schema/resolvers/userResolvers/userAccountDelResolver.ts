import { ApiError } from "@/lib/api/ApiError";
import { extendType } from "nexus";
import notifyKakfa from "@/lib/notifyKafka";
import { connectRedis } from "@/lib/redis";
import { signOut } from "@/app/api/auth/[...nextauth]/configs";
import { ApiResponse } from "@/lib/api/ApiResponse";

export const UserAccountDelete = extendType({
  type: "Mutation",
  definition(t) {
    t.field("userAccountDel", {
      type: "UserAccountDeleteResponse",
      resolve: async (_parnt, _args, ctx) => {
        try {
          const { user: authUser } = ctx;
          if (!authUser || !authUser._id) {
            return ApiError({
              statusCode: 401,
              success: false,
              code: "UNAUTHORIZED",
              message: "Unauthorized request",
              data: null,
            });
          }

          const userId = authUser._id;
          const redis = await connectRedis();
          await redis.del(`app:user:${userId.toString()}`);
          await notifyKakfa({
            userData: userId,
            action: "user-account-deletion",
          });
          await signOut({ redirect: false });

          return ApiResponse({
            statusCode: 202,
            success: true,
            code: "ACCOUNT_DELETION",
            message: "Your account will be deleted within 24 hours.",
            data: null,
          });
        } catch (error: any) {
          return ApiError({
            statusCode: 500,
            success: false,
            code: "INTERNAL_ERROR",
            message: error.message || "Internal server error",
            data: error || null,
          });
        }
      },
    });
  },
});
