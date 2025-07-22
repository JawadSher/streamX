"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Home: LucideIcons.Home,
  Film: LucideIcons.Film,
  MessageSquare: LucideIcons.MessageSquare,
  UserRound: LucideIcons.UserRound,
  History: LucideIcons.History,
  ListMusic: LucideIcons.ListMusic,
  Video: LucideIcons.Video,
  Clock: LucideIcons.Clock,
  ThumbsUp: LucideIcons.ThumbsUp,
  ThumbsDown: LucideIcons.ThumbsDown,
  ListVideo: LucideIcons.ListVideo
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
    css?: string;
    name?: string;
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const IconComponent = item.icon ? iconMap[item.icon] : null;
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.title} className="flex items-center justify-center">
              <SidebarMenuButton asChild className="mb-1 min-w-full">
                <Link
                  href={item.url}
                  title={item.title}
                  className={`flex items-center transition-colors duration-150 rounded-lg px-3 py-2 ${
                    state === "expanded" ? "gap-5" : "justify-center"
                  } ${
                    isActive
                      ? "bg-accent darK:text-white font-semibold"
                      : "hover:bg-accent dark:hover:text-white"
                  }`}
                >
                  {IconComponent && (
                    <div className="flex-shrink-0">
                      <IconComponent
                        size={20}
                        strokeWidth={isActive ? 3 : 1.89}
                      />
                    </div>
                  )}
                  
                  {state === "expanded" && (
                    <span
                      className={`${
                        item.url === "/" ? "text-base" : "text-sm"
                      }`}
                    >
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
