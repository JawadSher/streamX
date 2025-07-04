import { NextResponse } from "next/server";

export const ApiResponse = <T = unknown>(params: {
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
  code?: string;
  isGraphql?: boolean;
}) => {
  const {
    statusCode = 200,
    success = true,
    code,
    message,
    data = null,
    isGraphql = true,
  } = params;

  if (isGraphql) {
    return { statusCode, success, code, message, data };
  } 
    
  return NextResponse.json({
      statusCode,
      success,
      code,
      message,
      data,
    });
  
};
