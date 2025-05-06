import { UserAvatar } from "../user-avatar";
import UserAvatarChange from "./user-avatar-change";
import { imagePaths } from "@/lib/ImagePaths";

interface Props {
  avatarURL?: string | null;
  fullName?: string | null;
}

const FirstSection = ({ avatarURL, fullName }: Props) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-2 relative">
        <UserAvatar avatarURL={avatarURL || imagePaths.defaultUserLogo} />
        <UserAvatarChange />
      </div>
      <h1 className="text-[30px] font-bold text-gray-400">{fullName}</h1>
    </>
  );
};

export default FirstSection;
