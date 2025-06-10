import { gql } from "@apollo/client";

export const USER_ACC_DELETE = gql`
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
