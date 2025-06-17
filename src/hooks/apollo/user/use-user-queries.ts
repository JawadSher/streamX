import { GET_USER } from "@/graphql/queries/user";
import { UserResponse } from "@/reseponseTypes/UserResponse";
import { useQuery, useLazyQuery } from "@apollo/client";
import { CHECK_USER_NAME } from "@/graphql/queries/checkUserName";
import { UserNameResponse } from "@/reseponseTypes/UserNameCheckResponse";

export const useUserData = (enabled: boolean) => {
  return useQuery<UserResponse>(GET_USER, {
    skip: !enabled,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
};

export const useCheckUserName = () => {
  return useLazyQuery<UserNameResponse>(CHECK_USER_NAME, {
    fetchPolicy: "cache-and-network",
  });
};


