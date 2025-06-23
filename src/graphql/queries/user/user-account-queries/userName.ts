import { gql } from "@apollo/client";

export const CHECK_USER_NAME = gql`
  query CheckUserName($userName: String!, $isAuthentic: Boolean) {
    checkUserName(userName: $userName, isAuthentic: $isAuthentic) {
      statusCode
      message
      success
      code
      data {
        available
        validationError
      }
    }
  }
`;
