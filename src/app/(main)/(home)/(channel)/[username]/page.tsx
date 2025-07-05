"use client";

import ChannelHeader from "@/components/channel-page-components/channel-header";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function UserChannel() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <div className="w-full h-full pb-2">
      <div className="flex flex-col w-full h-full dark:bg-[#18181B] rounded-2xl p-4">
        {!loaded ? (
          <div className="w-full h-full flex items-start justify-center">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : (
          <>
            <ChannelHeader />
            <Separator />
          </>
        )}
      </div>
    </div>
  );
}

export default UserChannel;
