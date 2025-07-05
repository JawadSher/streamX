import { NextResponse } from "next/server";

export const NextApiResponse = <T = unknown>(params: {
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
  code?: string;
}) => {
  const {
    statusCode = 200,
    success = true,
    code,
    message,
    data = null,
  } = params;

  return NextResponse.json({ statusCode, success, code, message, data });
};
