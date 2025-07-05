import { IRedisDBUser as User } from "../interfaces/IRedisDBUser";

export interface UserResponse {
  getUser: {
    statusCode: number;
    success: boolean;
    message: string;
    data: User;
    __typename: string;
  };
}