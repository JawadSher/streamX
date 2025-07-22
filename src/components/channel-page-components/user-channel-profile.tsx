"use client";

import { UserAvatar } from "../user-avatar";
import Dot from "../dot";
import TotalSubscribers from "./total-subscribers";
import TotalVideos from "./total-videos";
import SubscribeBtn from "./subscribeBtn";
import UserChannelBanner from "./user-channel-banner";
import ChannelTabs from "./channel-tabs";
import { imagePaths } from "@/constants/ImagePaths";
import dynamic from "next/dynamic";
import useWindowWidth from "@/hooks/useWindowWidth";

const ChannelDescription = dynamic(() => import("./channel-description"), {
  ssr: false,
});

function UserChannelProfile() {
  const width = useWindowWidth();

  return (
    <div className="flex flex-col gap-5 w-full py-4 md:px-10 lg:px-20 xl:px-36">
      <UserChannelBanner className="rounded-2xl w-full" />

      <div className="flex w-full gap-4 ">
        <div className="sm:w-[120px]">
          <UserAvatar
            avatarURL={imagePaths.defaultUserLogo}
            width={130}
            height={130}
          />
        </div>

        <div className="flex flex-col items-start text-center gap-1 w-full">
          <h1 className="text-2xl sm:text-3xl font-semibold font-medium dark:text-zinc-300">
            Unknown User
          </h1>

          <div className="flex flex-col sm:flex-row gap-1 text-sm items-start h-full w-full">
            <h2 className="font-semibold dark:text-white">@unknown</h2>
            <div className="sm:flex gap-1 ">
              <Dot className="dark:text-zinc-300 hidden sm:block" />
              <TotalSubscribers />
              <Dot className="dark:text-zinc-300 hidden sm:block" />
              <TotalVideos />
            </div>
          </div>
          {width >= 700 && (
            <>
              <ChannelDescription className="mt-1 max-w-full" />
              <SubscribeBtn className="mt-1 rounded-full px-6 py-1.5 bg-gray-300 cursor-pointer hover:bg-gray-200 " />
            </>
          )}
        </div>
      </div>
      {width < 700 && (
        <>
          <ChannelDescription className="w-full" />
          <SubscribeBtn className="rounded-full h-7 bg-gray-300 cursor-pointer hover:bg-gray-200 w-full" />
        </>
      )}
      <ChannelTabs />
    </div>
  );
}

export default UserChannelProfile;
