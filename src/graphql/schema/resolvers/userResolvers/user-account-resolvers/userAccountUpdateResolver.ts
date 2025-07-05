import { ApiError } from "@/lib/api/ApiError";
import { GraphqlApiResponse } from "@/lib/api/GraphqlApiResponse";
import notifyKakfa from "@/lib/notifyKafka";
import { phoneNumberSchema } from "@/schemas/phoneNumberSchema";
import { userUpdateSchema } from "@/schemas/userUpdateSchema";
import { GraphQLError } from "graphql";
import { extendType, stringArg } from "nexus";
import mongoose from "mongoose";

export const UserAccountUpdateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("userAccountUpdate", {
      type: "UserAccountUpdateResponse",
      args: {
        firstName: stringArg(),
        lastName: stringArg(),
        country: stringArg(),
        phoneNumber: stringArg(),
      },
      resolve: async (args, ctx) => {
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

          const { firstName, lastName, country, phoneNumber } = args;
          const data = { firstName, lastName, country };
          const result = userUpdateSchema.safeParse(data);

          if (!result.success) {
            const fieldError = result.error.flatten().fieldErrors;
            ApiError({
              statusCode: 422,
              success: false,
              code: "VALIDATION_ERROR",
              message: "Validation failed. Please check the submitted fields.",
              data: fieldError,
            });
          }

          if (phoneNumber && phoneNumber.length > 0) {
            const numResult = phoneNumberSchema.safeParse(phoneNumber);
            if (!numResult.success) {
              const fieldError = numResult.error.flatten().fieldErrors;
              ApiError({
                statusCode: 422,
                success: false,
                code: "VALIDATION_ERROR",
                message:
                  "Validation failed. Please check the submitted fields.",
                data: fieldError,
              });
            }
          }

          const userData = {
            ...data,
            userId: authUser._id,
            phoneNumber,
          };

          await notifyKakfa({ userData, action: "user-update" });

          return GraphqlApiResponse({
            statusCode: 200,
            success: true,
            code: "USER_UPDATE",
            message: "Account updated successfuly",
            data: null,
          });
        } catch (error: any) {
          if (error instanceof GraphQLError) throw error;
          ApiError({
            statusCode: 500,
            success: false,
            code: "INTERNAL_ERROR",
            message: error.message || "Interal server error",
            data: null,
          });
        }
      },
    });
  },
});
