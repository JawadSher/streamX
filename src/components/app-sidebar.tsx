"use client";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { imagePaths } from "@/lib/ImagePaths";
import { NavMain } from "./nav-main";
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
import { Separator } from "./ui/separator";
import { NavMainSubscriptions } from "./nav-main-subscriptions";

type UserData = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  channelName?: string;
  phoneNumber?: string;
  country?: string;
  isVerified?: boolean;
  image?: string | null;
};

type Props = {
  data?: UserData;
  sessionStatus?: string;
} & React.ComponentProps<typeof Sidebar>;

const navItems = {
  mediaItems: [
    {
      title: "Home",
      url: `${API_ROUTES.HOME}`,
      icon: Home,
    },
    {
      title: "Shorts",
      url: `${API_ROUTES.SHORTS}`,
      icon: SquarePlay,
    },
    {
      title: "Community posts",
      url: `${API_ROUTES.COMMUNITY_POSTS}`,
      icon: StickyNote,
    },
  ],

  profileItems: [
    {
      title: "Profile",
      url: `${API_ROUTES.PROFILE}`,
      icon: CircleUserRound,
    },
    {
      title: "History",
      url: `${API_ROUTES.HISTORY}`,
      icon: History,
    },
    {
      title: "Playlists",
      url: `${API_ROUTES.PLAYLISTS}`,
      icon: ListVideo,
    },
    {
      title: "Your videos",
      url: `${API_ROUTES.VIDEO_UPLOADS}`,
      icon: SquarePlay,
    },
    {
      title: "Watch later",
      url: `${API_ROUTES.WATCH_LATER}`,
      icon: Clock4,
    },
    {
      title: "Liked videos",
      url: `${API_ROUTES.LIKEDVIDEOS}`,
      icon: ThumbsUp,
    },
    {
      title: "Disliked videos",
      url: `${API_ROUTES.DISLIKEDVIDEOS}`,
      icon: ThumbsDown,
    },
  ],

  subscriptionItems: [
    {
      title: "XYZ",
      url: `${API_ROUTES.CHANNEL}`,
      avatar: "",
    },
  ],
};

export function AppSidebar({ data, sessionStatus, ...props }: Props) {
  const { state } = useSidebar();

  const fullName = data
    ? [data.firstName, data.lastName].filter(Boolean).join(" ") ||
      data.userName ||
      "Guest"
    : "Guest";

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="m-2 rounded-lg overflow-hidden h-[calc(100vh-16px)]"
    >
      <SidebarHeader className="p-4 border-b">
        <h1 className="text-4xl font-mono text-center transition-all duration-200">
          {state === "expanded" ? "streamX" : "X"}
        </h1>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <NavMain items={navItems.mediaItems} />
        {state === "expanded" && <Separator className="max-w-[230px] mx-auto" />}
        <NavMain items={navItems.profileItems} />
        {state === "expanded" && <Separator className="max-w-[230px] mx-auto" />}
        <NavMainSubscriptions items={navItems.subscriptionItems}  />
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        {sessionStatus === "authenticated" ? (
          <NavUser
            user={{
              name: fullName,
              email: data?.email || "",

              image: data?.image || imagePaths.defaultUserLogo,
              isVerified: data?.isVerified || false,
            }}
          />
        ) : (
          <Link href="/sign-in" className="w-full flex grow">
            {state === "collapsed" ? (
              <Image
                src={imagePaths.defaultUserLogo}
                alt="Login"
                width={32}
                height={32}
              />
            ) : (
              <Button className="w-full flex grow cursor-pointer">Login</Button>
            )}
          </Link>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
