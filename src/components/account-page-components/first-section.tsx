import React from "react";
import { UserAvatar } from "../user-avatar";
import { Camera } from "lucide-react";

interface Props{
    avatarURL?: string | null;
    fullName?: string | null;
}

const FirstSection = ({ avatarURL, fullName }: Props) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-2 relative">
        <UserAvatar avatarURL={avatarURL || "/defaultUser.png"} />
        <Camera className="cursor-pointer absolute right-1 bottom-5 lucid-icons" size={20} strokeWidth={3} />
      </div>
      <h1 className="text-[30px] font-bold text-gray-400">{fullName}</h1>
    </>
  );
};

export default FirstSection;
