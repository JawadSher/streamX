import { GraphQLError } from "graphql";

export const ApiError = ({
  statusCode = 400,
  success = false,
  code = "INTERNAL_ERROR",
  message,
  data = null,
}: {
  message: string;
  statusCode?: number;
  success?: boolean;
  data?: any;
  code?: string;
}) => {
  return {
    statusCode,
    success,
    message,
    code,
    data,
  };
};
