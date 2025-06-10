import { gql } from "@apollo/client";

export const USER_ACCNT_DELETE = gql`
  mutation UserAccountDel {
    userAccountDel {
      statusCode
      success
      code
      message
      data {
        error
        null
      }
    }
  }
`;
