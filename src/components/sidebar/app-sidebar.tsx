"use client";

import {
  Sidebar,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import SideBarTop from "./sidebar-header";
import { Separator } from "../ui/separator";

import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import SidebarBottom from "./sidebar-footer";
import { Suspense } from "react";
import UserSkeleton from "../skeletons/user-skeleton";

import { usePathname } from "next/navigation";
import MainSidebarContent from "./sidebar-content";
import AccountSidebarContent from "../account-page-components/account-sidebar-content";
import { mediaSectionItems, userSectionItems } from "@/constants/navConfig";

const navItems = {
  mediaItems: mediaSectionItems,
  profileItems: userSectionItems,

  subscriptionItems: [
    { title: "XYZ", url: `${API_ROUTES.CHANNEL}`, avatar: "" },
    
  ],
};

export function AppSidebar({
  status,
  userData,
}: {
  status: string;
  userData: IRedisDBUser | null;
}) {
  const { state } = useSidebar();
  const path = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="m-2 rounded-lg overflow-hidden h-[calc(100vh-16px)]"
    >
      <SideBarTop state={state} />

      {path.startsWith("/account") ? (
        <AccountSidebarContent userInfo={userData} />
      ) : (
        <MainSidebarContent
          mediaItems={navItems.mediaItems}
          profileItems={navItems.profileItems}
          subscriptionItems={navItems.subscriptionItems}
          status={status}
          state={state}
        />
      )}

      <Separator />
      <SidebarFooter>
        <Suspense fallback={<UserSkeleton />}>
          <SidebarBottom status={status} userData={userData} state={state} />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
