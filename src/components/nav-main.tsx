// src/components/nav-main.tsx
"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  const handleNavigation = (url: string) => {

    if (url === "/") {
      window.location.href = url;
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              {item.url === "/" ? (
                <div
                  onClick={() => handleNavigation(item.url)}
                  className={`flex items-center gap-6 cursor-pointer ${
                    pathname === item.url
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.icon && <item.icon size={16} />}
                  <span className="text-[15px]">{item.title}</span>
                </div>
              ) : (
                <Link
                  href={item.url}
                  title={item.title}
                  className={`flex items-center gap-6 ${
                    pathname === item.url
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.icon && <item.icon size={16} />}
                  <span className="text-[15px]">{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}