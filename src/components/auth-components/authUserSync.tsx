"use client";

import { clearUser, setUser } from "@/features/user/userSlice";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

async function getUser() {
  const response = await axiosInstance.get("/api/get-user-data");
  return response.data; 
}

const AuthUserSync = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const {
    data: userInfo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: getUser,
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30,  
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  useEffect(() => {
    if (isLoading || isError) return;

    if (session?.user?._id && status === "authenticated" && userInfo && isLoading === false) {
      const normalizedUserInfo = {
        _id: userInfo.data._id ?? null,
        firstName: userInfo.data.firstName ?? null,
        lastName: userInfo.data.lastName ?? null,
        email: userInfo.data.email ?? null,
        avatar: userInfo.data.avatar ?? null,
        banner: userInfo.data.banner ?? null,
        phoneNumber: userInfo.data.phoneNumber ?? null,
        country: userInfo.data.country ?? null,
        isVerified: userInfo.data.isVerified ?? null,
        accountStatus: userInfo.data.accountStatus ?? null,
        bio: userInfo.data.bio ?? null,
        watchHistory: userInfo.data.watchHistory ?? [],
        channelName: userInfo.data.channelName ?? null,
      };
      dispatch(setUser(normalizedUserInfo));
    } else if (
      (!session?.user?._id && status === "unauthenticated") ||
      status === "loading"
    ) {
      dispatch(clearUser());
    }
  }, [session, status, userInfo, isLoading, isError, dispatch]);

  return null;
};

export default AuthUserSync;
