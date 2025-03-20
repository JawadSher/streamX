"use client";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import defaultUserImage from "../../public/defaultUser.png"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

type userData = {
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
} & React.ComponentProps<typeof Sidebar>;


export function AppSidebar({ data, ...props}: {data?: userData}) {
  const { state } = useSidebar();

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
        {/* <NavMain items={data.navMain} />
        {Array.from({ length: 3 }).map((_, i) => (
          <NavProjects key={i} projects={data.projects} />
        ))} */}
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <NavUser user={{
          firstName: data?.firstName || "Guest",
          lastName: data?.lastName || "Guest",
          email: data?.email || "guest@example.com",
          image: data?.image || "../../public/defaultUser.png",
          isVerified: data?.isVerified || false
        }} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
