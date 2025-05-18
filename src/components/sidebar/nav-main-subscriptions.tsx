"use client";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/legacy/image";

export function NavMainSubscriptions({
  items,
}: {
  items: {
    title: string;
    url: string;
    avatar: string;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={false} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="cursor-pointer">
                <SidebarGroupLabel className="dark:text-white text-[18px]">
                  Subscriptions
                </SidebarGroupLabel>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                {items.map((item, index) => (
                  <SidebarMenuSubItem key={index}>
                    <SidebarMenuSubButton
                      asChild
                      className={`${
                        pathname === item.url
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Link href={item.url}>
                        <Image
                          src={item.avatar}
                          alt="LOG"
                          width={34}
                          height={34}
                          quality={50}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
