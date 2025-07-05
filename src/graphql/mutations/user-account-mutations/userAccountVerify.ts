import { gql } from "@apollo/client";

export const USER_ACCNT_VERIFY = gql`
  mutation UserAccountVerify($state: String!, $u_OTP: String) {
    userAccountVerify(state: $state, u_OTP: $u_OTP) {
      statusCode
      code
      success
      message
      data {
        error
        null
        OTP_Expires_On
        coolDownTime
      }
    }
  }
`;
