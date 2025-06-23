import { signOut } from "@/app/api/auth/[...nextauth]/configs";
import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { connectRedis } from "@/lib/redis";
import { GraphQLError } from "graphql";
import { extendType } from "nexus";
import mongoose from "mongoose";

export const UserLogoutMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("logoutUser", {
      type: "UserLogoutResponse",
      resolve: async (_parnt, _args, ctx) => {
        try {
          const { user: authUser } = ctx;

          if (
            !authUser ||
            !authUser._id ||
            !mongoose.isValidObjectId(authUser._id)
          ) {
            ApiError({
              statusCode: 401,
              success: false,
              code: "UNAUTHORIZED",
              message: "Unauthorized request",
              data: null,
            });
          }

          const redis = await connectRedis();
          const userId = authUser?._id.toString();
          await redis.expire(`app:user:${userId}`, 60 * 60 * 24 * 7);
          await signOut({ redirect: false });

          return ApiResponse({
            statusCode: 200,
            success: true,
            message: "User Logout Successfully",
            data: null,
          });
        } catch (error: any) {
          if (error instanceof GraphQLError) throw error;

          ApiError({
            statusCode: 400,
            success: false,
            code: "INTERNAL_ERROR",
            message: "Internal Server Error",
            data: error,
          });
        }
      },
    });
  },
});
