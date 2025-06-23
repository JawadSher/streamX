import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      statusCode
      code
      message
      success
      data {
        error
        null
      }
    }
  }
`;
