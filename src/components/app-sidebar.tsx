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
        {/* <NavMain items={data.navMain} />
        {Array.from({ length: 3 }).map((_, i) => (
          <NavProjects key={i} projects={data.projects} />
        ))} */}
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
