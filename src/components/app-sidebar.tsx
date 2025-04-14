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
import { useSession } from "next-auth/react";
import {
  Home,
  StickyNote,
  CircleUserRound,
  History,
  ListVideo,
  Clock4,
  ThumbsUp,
  ThumbsDown,
  SquarePlay,
} from "lucide-react";
import { API_ROUTES } from "@/lib/api/ApiRoutes";
import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import SidebarBottom from "./sidebar-footer";

const navItems = {
  mediaItems: [
    { title: "Home", url: `${API_ROUTES.HOME}`, icon: Home },
    { title: "Shorts", url: `${API_ROUTES.SHORTS}`, icon: SquarePlay },
    {
      title: "Community posts",
      url: `${API_ROUTES.COMMUNITY_POSTS}`,
      icon: StickyNote,
    },
  ],
  profileItems: [
    { title: "Profile", url: `${API_ROUTES.PROFILE}`, icon: CircleUserRound },
    { title: "History", url: `${API_ROUTES.HISTORY}`, icon: History },
    { title: "Playlists", url: `${API_ROUTES.PLAYLISTS}`, icon: ListVideo },
    {
      title: "Your videos",
      url: `${API_ROUTES.VIDEO_UPLOADS}`,
      icon: SquarePlay,
    },
    { title: "Watch later", url: `${API_ROUTES.WATCH_LATER}`, icon: Clock4 },
    { title: "Liked videos", url: `${API_ROUTES.LIKEDVIDEOS}`, icon: ThumbsUp },
    {
      title: "Disliked videos",
      url: `${API_ROUTES.DISLIKEDVIDEOS}`,
      icon: ThumbsDown,
    },
  ],
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

  return (
    <Sidebar
      collapsible="icon"
      className="m-2 rounded-lg overflow-hidden h-[calc(100vh-16px)]"
    >
      <SideBarTop state={state} />
      <SidebarContent className="overflow-y-auto custom-scroll-bar">
        <NavMain items={navItems.mediaItems} />
        {status === "authenticated" && (
          <>
            {state === "expanded" && (
              <Separator className="max-w-[230px] mx-auto" />
            )}
            <NavMain items={navItems.profileItems} />
            {state === "expanded" && (
              <Separator className="max-w-[230px] mx-auto" />
            )}
            <NavMainSubscriptions items={navItems.subscriptionItems} />
          </>
        )}
      </SidebarContent>

      <Separator />
      <SidebarFooter>
        <SidebarBottom status={status} userData={userData} state={state} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
