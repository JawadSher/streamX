import { GraphQLError } from "graphql";
import { NextResponse } from "next/server";

export const ApiError = ({
  statusCode = 400,
  success = false,
  code = "INTERNAL_ERROR",
  message,
  data,
  isGraphql = true,
}: {
  message: string;
  statusCode?: number;
  success?: boolean;
  code?: string;
  data?: any;
  isGraphql?: boolean;
}) => {
  if (isGraphql) {
    throw new GraphQLError(message, {
      extensions: { code, success, message, statusCode, data },
    });
  } else {
    return NextResponse.json({
      statusCode,
      message,
      success,
      code,
      data,
    });
  }
};
