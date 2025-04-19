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
import { useState, useEffect } from "react";
import { SidebarItemsSkeleton } from "./skeletons/sidebar-items-skeleton";

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
  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    const checkFontLoaded = () => {
      if (document.fonts) {
        document.fonts.ready.then(() => {
          const materialIconsLoaded = Array.from(document.fonts).some((font) =>
            font.family.includes("Material Symbols")
          );

          if (materialIconsLoaded) setIconsLoaded(true);
        });
      } else {
        setTimeout(() => setIconsLoaded(true), 1000);
      }
    };

    checkFontLoaded();
  }, []);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {
              !iconsLoaded ? (
                <SidebarItemsSkeleton />
              ) : (
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
                  <div
                    className={`${item.css} ${
                      pathname === item.url ? "navItems" : ""
                    } ${!iconsLoaded ? "icon-loading" : ""}`}
                  >
                    {item.icon}
                  </div>
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
              )
            }
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
