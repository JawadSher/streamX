import { NextResponse } from "next/server";

export function ApiResponse(statusCode: number = 200, message: string, data: any) {
  return NextResponse.json(
    {
      message,
      status: "success",
      statusCode,
      data,
    },
    { status: statusCode }
  );
}
