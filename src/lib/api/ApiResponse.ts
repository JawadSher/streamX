export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data: T;
  public statusCode: number;

  constructor(statusCode: number, message: string, data: T) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}
