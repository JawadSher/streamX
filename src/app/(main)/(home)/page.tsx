"use client";

import { useFetchUserData } from "@/hooks/useUser";
import { setUser } from "@/store/features/user/userSlice";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function Home() {
  const { status } = useSession();
  const dispatch = useDispatch();
  const {
    data: response,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useFetchUserData();

  useEffect(() => {
    if (status === "authenticated" && isSuccess && !isError) {
      const userData = response?.data?.data;
      dispatch(setUser(userData));
    }
  }, [status, isSuccess, isError, response, dispatch]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-fit rounded-2xl">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full rounded-md bg-gray-600 relative items-center overflow-auto custom-scroll-bar mb-2">
      <p>Hello world</p>
      {isError && error && (
        <span className="bg-yellow-600 w-[95%] sticky bottom-2 z-10 mx-auto px-2 font-normal text-center text-black rounded-sm">
          {error.message}
        </span>
      )}
    </div>
  );
}

export default Home;
