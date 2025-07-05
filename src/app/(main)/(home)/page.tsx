"use client";

import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function Home() {
  const isLoading = useSelector((state: any) => state.user.isLoading);
  const error = useSelector((state: any) => state.user.error);

  if (isLoading) {
    return (
      <div className="flex w-full h-full rounded-md bg-gray-600 relative items-center justify-center overflow-auto custom-scroll-bar mb-2">
        <Loader2
          size={34}
          className="animate-spin text-white absolute top-60"
        />
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
