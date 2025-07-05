import { ApiError } from "@/lib/api/ApiError";
import { ApiResponse } from "@/lib/api/ApiResponse";
import { connectRedis } from "@/lib/redis";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { extendType } from "nexus";

export const UserProfileQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getProfile", {
      type: "UserProfileResponse",
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

          const fields = [
            "watchHistory",
            "watchLater",
            "likedVideos",
            "disLikedVideos",
          ];

          const userId = authUser._id;
          const redis = await connectRedis();
          const userProfile = await redis.hmget(
            `app:user:${userId}`,
            ...fields
          );

          return ApiResponse({
            statusCode: 200,
            success: true,
            code: "PROFILE_FETCHED",
            message: "User profile fetched",
            data: {
              ...userProfile,
            },
          });
        } catch (error: any) {
          if (error instanceof GraphQLError) throw error;
          ApiError({
            statusCode: 400,
            success: false,
            code: "INTERNAL_ERROR",
            message: "Server error while fetching user profile",
            data: null,
          });
        }
      },
    });
  },
});
