"use client";

import { useAppDispatch } from "@/hooks/redux.hooks";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { sanitizeUserData } from "@/lib/sanatizeUserData";
import { setUser } from "@/store/features/user/userSlice";
import { useEffect } from "react";

function UserDataFetcher({ initialUserData }: { initialUserData: IRedisDBUser | null }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialUserData) {
      dispatch(setUser(sanitizeUserData(initialUserData)));
    }
  }, [initialUserData, dispatch]);

  return null;
}

export default UserDataFetcher;
