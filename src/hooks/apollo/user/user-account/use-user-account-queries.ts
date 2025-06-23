import { CHECK_USER_NAME } from "@/graphql/queries/user/user-account-queries/userName";
import { UserNameResponse } from "@/reseponseTypes/UserNameCheckResponse";
import { useLazyQuery } from "@apollo/client";


export const useCheckUserName = () => {
  return useLazyQuery<UserNameResponse>(CHECK_USER_NAME, {
    fetchPolicy: "cache-and-network",
  });
};
