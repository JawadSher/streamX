import { GET_USER_PROFILE } from "@/graphql/queries/user/user-profile-queries/userProfile";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";

export const useUserProfile = () => {
  const { status } = useSession();
  const shouldFetch = status === "authenticated";

  return useQuery(GET_USER_PROFILE, {
    skip: !shouldFetch,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
};
