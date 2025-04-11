import { ApiResponse } from "@/lib/api/ApiResponse";
import { fetchUserFromMongoDB } from "@/lib/fetchUserFromMongoDB";
import { getUserFromRedis } from "@/lib/getUserFromRedis";
import { ApiError } from "@/lib/api/ApiError";
import { auth } from "../auth/[...nextauth]/configs";

export async function GET() {
  const session = await auth();
  const userId = session?.user?._id;

  console.log(session?.user);

  if (!userId) {
    const error = new ApiError("Unauthorized request", 400);

    return new Response(JSON.stringify(error.error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    let userData = await getUserFromRedis(userId!) || await fetchUserFromMongoDB({ userId });

    if (!userData) {
      const error = new ApiError("User not found", 404);
      return new Response(JSON.stringify(error.error), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = new ApiResponse(
      200,
      "User data fetched successfully",
      {
        ...userData
      }
    );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const apiError = new ApiError("Error while fetching user data", 500);

    return new Response(JSON.stringify(apiError.error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
