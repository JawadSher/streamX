import { SidebarContent } from "../ui/sidebar";
import UserProfileInfo from "./user-profile-info";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";

interface AccountSidebarContentProps {
  userInfo: IRedisDBUser | null;
}

const AccountSidebarContent = ({ userInfo }: AccountSidebarContentProps) => {
  return (
    <SidebarContent className="overflow-y-auto custom-scroll-bar mt-4">
      <UserProfileInfo userInfo={userInfo} />
    </SidebarContent>
  );
};

export default AccountSidebarContent;
