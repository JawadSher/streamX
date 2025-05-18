import { NextResponse } from "next/server";

export function ApiError(statusCode: number = 400, message: string, data: any) {
  return NextResponse.json(
    {
      message,
      status: "false",
      statusCode,
      data,
    },
    { status: statusCode }
  );
}
