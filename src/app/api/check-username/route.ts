import { connectDB } from "@/lib/database";
import { z } from "zod";
import UserModel from "@/models/user.model";
import { ApiError } from "next/dist/server/api-utils";
import { ApiResponse } from "@/lib/api/ApiResponse";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userName = searchParams.get("username");

  try {
    await connectDB();
    const user = await UserModel.findOne({ userName });

    if (user) {
        return new Response(JSON.stringify({ error: "Username is already taken" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(
      JSON.stringify(new ApiResponse(200, "Username is available")),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: error.statusCode,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
