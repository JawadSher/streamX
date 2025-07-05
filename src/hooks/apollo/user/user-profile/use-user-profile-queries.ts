import { GET_USER_PROFILE } from "@/graphql/queries/user/user-profile-queries/userProfile";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useUserProfile = () => {
  const { status } = useSession();
  const [enabled, setEnabled] = useState<boolean>(false);
  useEffect(() => {
    if (status === "authenticated") setEnabled(true);
    else setEnabled(false);
  }, [status]);

  return useQuery(GET_USER_PROFILE, {
    skip: !enabled,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
};
