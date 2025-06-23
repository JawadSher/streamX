import { GET_USER } from "@/graphql/queries/user/user";
import { UserResponse } from "@/reseponseTypes/UserResponse";
import { useQuery } from "@apollo/client";

export const useUserData = (enabled: boolean) => {
  return useQuery<UserResponse>(GET_USER, {
    skip: !enabled,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
};

