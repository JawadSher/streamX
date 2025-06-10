import { GraphQLError } from "graphql";

export const ApiError = ({
  statusCode = 400,
  success = false,
  code = "INTERNAL_ERROR",
  message,
  data,
}: {
  message: string;
  statusCode?: number;
  success?: boolean;
  code?: string;
  data?: any;
}) => {
  throw new GraphQLError(message, {
    extensions: { code, success, message, statusCode, data },
  });
};
