export interface ActionError {
  message: string;
  statusCode: number;
  status: string;
  data: any;
}

export function actionError(statusCode = 400, message: string, data: any): ActionError {
  return {
    message,
    statusCode,
    status: "false",
    data,
  };
}