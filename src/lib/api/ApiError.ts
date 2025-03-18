export class ApiError extends Error {
  public success: boolean;
  public message: string;
  public statusCode: number;
  public stack?: string;

  constructor(message: string = "An error occurred", statusCode: number = 500) {
    super(message);
    this.success = false;
    this.message = message;
    this.statusCode = statusCode;
    if (process.env.NODE_ENV === 'development') {
      this.stack = this.stack;
    }
  }

  get error() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      ...(this.stack && { stack: this.stack })
    };
  }
}
