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

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string | "";
    css?: string;
    name?: string;
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className="mb-1">
              <Link
                href={item.url}
                title={item.title}
                className={`flex ${
                  state === "expanded" ? "items-center gap-6" : "justify-center"
                } ${
                  pathname === item.url
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.icon && item.icon !== "" && (
                  <div className={`${item.css} short`}>{item.icon}</div>
                )}
                {state === "expanded" && (
                  <div
                    className={`${
                      item.url === "/" ? "text-[16px]" : "text-[15px]"
                    }`}
                  >
                    {item.title}
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
