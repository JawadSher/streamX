"use client";

import { useFetchUserData } from "@/hooks/useUser";
import { setError, setLoading, setUser } from "@/store/features/user/userSlice";
import { NetworkStatus } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";

export const UserProvider = () => {
  const { status } = useSession();
  const dispatch = useDispatch();

  const [enabled, setEnabled] = useState(false);
  const { data, error, loading, networkStatus } = useFetchUserData(enabled);

  useEffect(() => {
    setEnabled(status === "authenticated");
  }, [status]);

  useEffect(() => {
    if (data?.getUser?.success && data.getUser.data) {
      dispatch(setUser(data.getUser.data));
    }
    dispatch(setError(error ? error.message : null));
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
