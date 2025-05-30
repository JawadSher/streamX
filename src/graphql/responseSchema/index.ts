import { createApiResponse } from "./ApiResponse"; 
import { User } from "../schema/types/User";

export const UserResponse = createApiResponse("UserResponse", User);
