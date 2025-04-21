import { cssUnfillProperty } from "@/constants/navConfig";
import React from "react";
import { UserAvatar } from "../user-avatar";

interface Props{
    avatarURL?: string | null;
    fullName?: string | null;
}

const FirstSection = ({ avatarURL, fullName }: Props) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-2 relative">
        <UserAvatar avatarURL={avatarURL || "/defaultUser.png"} />
        <span
          className={`${cssUnfillProperty} text-zinc-600 dark:text-white text-lg cursor-pointer absolute right-1 bottom-3`}
        >
          photo_camera
        </span>
      </div>
      <h1 className="text-[30px] font-bold text-gray-400">{fullName}</h1>
    </>
  );
};

export default FirstSection;
