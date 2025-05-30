export const ApiResponse = <T>(params: {
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
}) => {
  const { statusCode = 200, success = true, message, data = null } = params;
  return { statusCode, success, message, data };
};
