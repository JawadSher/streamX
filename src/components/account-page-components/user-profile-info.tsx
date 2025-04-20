import React from "react";
import { UserAvatar } from "../user-avatar";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import { fullname } from "@/lib/fullname";

interface UserProfileInfoProps {
  userInfo: IRedisDBUser | null;
}

const UserProfileInfo = ({ userInfo }: UserProfileInfoProps) => {
  const fullName = fullname({
    firstName: userInfo?.firstName,
    lastName: userInfo?.lastName,
    userName: userInfo?.userName,
  });

  return (
    <div className="flex flex-col w-full h-full items-center justify-start">
      <div className="flex flex-col items-center justify-center py-2">
        <UserAvatar avatarURL={userInfo?.avatarURL || "/defaultUser.png"} />
        <h1 className="text-[25px] font-bold text-gray-400">{fullName}</h1>
      </div>
    </div>
  );
};

export default UserProfileInfo;
