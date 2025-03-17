export class ApiError {
  public success: boolean;
  public error: {
    message: string;
    statusCode?: number;
  };

  constructor(message: string, statusCode?: number) {
    this.success = false;
    this.error = { message, statusCode };
  }
}
