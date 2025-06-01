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
}): {
  statusCode: number;
  success: boolean;
  code: string;
  message: string;
  data: any;
} => {
  return {
    statusCode,
    success,
    code,
    message,
    data,
  };
};
