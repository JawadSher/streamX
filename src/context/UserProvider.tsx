"use client";

import { useUserData } from "@/hooks/apollo";
import { extractGraphQLError } from "@/lib/extractGraphqlError";
import { setError, setLoading, setUser } from "@/store/features/user/userSlice";
import { NetworkStatus } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const UserProvider = () => {
  const { status } = useSession();
  const dispatch = useDispatch();

  const [enabled, setEnabled] = useState(false);
  const { data, error, loading, networkStatus } = useUserData(enabled);

  useEffect(() => {
    setEnabled(status === "authenticated");
  }, [status]);

  useEffect(() => {
    if (data?.getUser?.success && data.getUser.data) {
      dispatch(setUser(data.getUser.data));
    }

    if (error) {
      const { message } = extractGraphQLError(error);
      dispatch(setError(message));

      let isRateLimit = false;
      if (error?.networkError) {
        const message = error.networkError.message?.toLowerCase();
        isRateLimit =
          message?.includes("429") || message?.includes("too many requests");
      }

      if (isRateLimit) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(error.message);
      }
    } else {
      dispatch(setError(null));
    }
  }, [data, error, dispatch]);

  const isLoading = useMemo(
    () =>
      status === "loading" ||
      loading ||
      networkStatus === NetworkStatus.refetch,
    [status, loading, networkStatus]
  );

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  return null;
};
