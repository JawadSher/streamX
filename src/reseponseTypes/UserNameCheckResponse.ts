export interface UserNameResponse {
  checkUserName: {
    statusCode: number;
    success: boolean;
    message: string;
    data?: {
      available: boolean;
      validationError: string;
    } | null;
    __typename: string;
  };
}
