import { gql } from "@apollo/client";

export const SIGNUP_USER = gql`
  mutation SignUpUser(
    $firstName: String!
    $lastName: String!
    $userName: String!
    $email: String!
    $password: String!
  ) {
    signUpUser(
      firstName: $firstName
      lastName: $lastName
      userName: $userName
      email: $email
      password: $password
    ) {
      statusCode
      message
      code
      success
      data {
        error
      }
    }
  }
`;
