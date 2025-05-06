"use client";

import { UserAvatar } from "../user-avatar";
import Dot from "../dot";
import TotalSubscribers from "./total-subscribers";
import TotalVideos from "./total-videos";
import ChannelDescription from "./channel-description";
import SubscribeBtn from "./subscribeBtn";
import UserChannelBanner from "./user-channel-banner";
import useWindowWidth from "@/hooks/useWindowWidth";
import ChannelTabs from "./channel-tabs";
import { imagePaths } from "@/lib/ImagePaths";

function UserChannelProfile() {
  const width = useWindowWidth();

  return (
    <div
      className={`flex flex-col gap-5 w-full py-2 ${
        width <= 1200 ? "px-0" : "px-35"
      }`}
    >
      <UserChannelBanner className="rounded-2xl" />
      <div className="flex w-full items-center gap-4">
        <UserAvatar
          avatarURL={imagePaths.defaultUserLogo}
          width={130}
          height={130}
        />
        <div className="flex flex-col items-start justify-center gap-1 ">
          <h1 className="text-3xl font-bold dark:text-zinc-300">
            Unknown User
          </h1>

          <div className="flex gap-1">
            <h2 className="text-md font-semibold dark:text-white">@unknown</h2>
            <Dot className="dark:text-zinc-300" />
            <TotalSubscribers />
            <Dot className="dark:text-zinc-300" />
            <TotalVideos />
          </div>
          <ChannelDescription className="flex items-center justify-center" />
          <SubscribeBtn className="rounded-full px-6 bg-gray-300 cursor-pointer hover:bg-gray-200" />
        </div>
      </div>
      <ChannelTabs />
    </div>
  );
}

export default UserChannelProfile;
