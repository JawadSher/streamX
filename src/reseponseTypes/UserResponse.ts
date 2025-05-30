import { User } from "../types";

export interface UserResponse {
  getUser: {
    statusCode: number;
    success: boolean;
    message: string;
    data: User;
    __typename: string;
  };
}