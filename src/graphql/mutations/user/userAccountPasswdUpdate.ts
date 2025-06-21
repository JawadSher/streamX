import { gql } from "@apollo/client";

export const USER_ACCNT_PASSWD_UPDATE = gql`
  mutation UserAccountPasswdUpdate($password: String!) {
    userAccountPasswdUpdate(password: $password) {
      statusCode
      code
      success
      message
      data {
        null
        error
      }
    }
  }
`;
