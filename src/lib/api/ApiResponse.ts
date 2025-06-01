export const ApiResponse = <T>(params: {
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
  code?: string;
}) => {
  const { statusCode = 200, success = true, code, message, data = null } = params;
  return { statusCode, success, code, message, data };
};
