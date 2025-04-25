export interface ActionResponse<T = any> {
  message: string;
  status: "success";
  statusCode: number;
  data: T;
}

export function actionResponse<T>(statusCode = 200, message: string, data: T): ActionResponse<T> {
  return {
    message,
    statusCode,
    status: "success",
    data,
  };
}