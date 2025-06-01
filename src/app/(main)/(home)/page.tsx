"use client";

import { useFetchUserData } from "@/hooks/useUser";
import { setUser } from "@/store/features/user/userSlice";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NetworkStatus } from "@apollo/client";

export default function Home() {
  const { status } = useSession();
  const dispatch = useDispatch();
  const [enabled, setEnabled] = useState<boolean>(false);
  const { data, error, loading, networkStatus } = useFetchUserData(enabled);

  useEffect(() => {
    if (data?.getUser?.success && data.getUser?.data) {
      dispatch(setUser(data.getUser.data));
    }

    if (status === "authenticated") setEnabled(true);
    else setEnabled(false);
  }, [data, dispatch, status]);

  if (
    status === "loading" ||
    loading ||
    networkStatus === NetworkStatus.refetch
  ) {
    return (
      <div className="flex w-full h-full rounded-md bg-gray-600 relative items-center justify-center overflow-auto custom-scroll-bar mb-2">
        <Loader2 size={34} className="animate-spin text-white absolute top-60" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full rounded-md bg-gray-600 relative items-center overflow-auto custom-scroll-bar mb-2">
      {error && (
        <span className="bg-yellow-600 w-[95%] sticky bottom-2 z-10 mx-auto px-2 font-normal text-center text-black rounded-sm">
          {error.message}
        </span>
      )}
    </div>
  );
}
