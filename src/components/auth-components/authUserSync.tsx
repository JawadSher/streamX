"use client";

import { clearUser, IUser, setUser } from "@/features/user/userSlice";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AuthUserSync = ({ userInfo }: {userInfo: IUser }) => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {

    if (session?.user?._id && status === "authenticated") {
      const normalizedUserInfo = {
        _id: userInfo._id ?? null,
        firstName: userInfo.firstName ?? null,
        lastName: userInfo.lastName ?? null,
        email: userInfo.email ?? null,
        avatar: userInfo.avatar ?? null,
        banner: userInfo.banner ?? null,
        phoneNumber: userInfo.phoneNumber ?? null,
        country: userInfo.country ?? null,
        isVerified: userInfo.isVerified ?? null,
        accountStatus: userInfo.accountStatus ?? null,
        bio: userInfo.bio ?? null,
        watchHistory: userInfo.watchHistory ?? [],
        channelName: userInfo.channelName ?? null,
      };
      dispatch(setUser(normalizedUserInfo));
    } else if (
      (!session?.user?._id && status === "unauthenticated") ||
      status === "loading"
    ) {
      dispatch(clearUser());
    }
  }, [session, status, userInfo, dispatch]);

  return null;
};

export default AuthUserSync;
