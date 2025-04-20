"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavMainSubscriptions } from "./nav-main-subscriptions";
import SideBarTop from "./sidebar-header";
import { Separator } from "./ui/separator";

import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import SidebarBottom from "./sidebar-footer";
import { Suspense } from "react";
import UserSkeleton from "./skeletons/user-skeleton";
import { mediaSectionItems, userSectionItems } from "@/constants/navConfig";
import { usePathname } from "next/navigation";

const navItems = {
  mediaItems: mediaSectionItems,
  profileItems: userSectionItems,

  subscriptionItems: [
    { title: "XYZ", url: `${API_ROUTES.CHANNEL}`, avatar: "" },
    // ... other items
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
      <SidebarContent className="overflow-y-auto custom-scroll-bar">
        {!path.startsWith("/account") && (
          <NavMain items={navItems.mediaItems} />
        )}

        {status === "authenticated" && (
          <>
            {state === "expanded" && !path.startsWith("/account") && (
              <Separator className="max-w-[230px] mx-auto" />
            )}
            {!path.startsWith("/account") && (
              <NavMain items={navItems.profileItems} />
            )}
            {state === "expanded" && !path.startsWith("/account") && (
              <>
                <Separator className="max-w-[230px] mx-auto" />
                <NavMainSubscriptions items={navItems.subscriptionItems} />
              </>
            )}
          </>
        )}
      </SidebarContent>
      
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
