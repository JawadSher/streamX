"use client";

import { setAuth } from "@/features/user/authSlice";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AuthSync = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {

    if (session?.user?._id && status === "authenticated")
      dispatch(setAuth("authenticated"));
    else if (!session?.user?._id && status === "unauthenticated")
      dispatch(setAuth("unauthenticated"));
    else if (status === "loading") dispatch(setAuth("loading"));
  }, [session, status, dispatch]);

  return null;
};

export default AuthSync;
