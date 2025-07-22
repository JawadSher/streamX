"use client";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Moon,
  Sun,
  Upload,
  Video,
  StickyNote,
  Bell,
  Plus,
  MessageCircleMore,
} from "lucide-react";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/ApiRoutes";
import Link from "next/link";
import TopHeader from "./account-page-components/top-header";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useEffect, useState } from "react";
import SidebarToggle from "./sidebar/sidebar-trigger";
import dynamic from "next/dynamic";

const SmallSearchBar = dynamic(
  () => import("./searchbar-components/small-searchbar"),
  { ssr: false }
);
const FullSearchBar = dynamic(
  () => import("./searchbar-components/full-searchbar"),
  { ssr: false }
);

const Header = () => {
  const { setTheme } = useTheme();
  const path = usePathname();

  const { status } = useSession();
  const isAuthenticated =
    status === "authenticated" ? "authenticated" : "unauthenticated";

  const width = useWindowWidth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-2 p-4 z-50 bg-sidebar h-16 flex items-center px-4  w-full mx-auto rounded-t-md rounded-b-sm">
      <div className="flex items-center gap-3">
        {mounted ? (
          (!path.includes("/account") ||
            (path.startsWith("/account") && width <= 767)) && <SidebarToggle />
        ) : (
          <div className="w-10 h-10" />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme("light")}
            >
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme("dark")}
            >
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTheme("system")}
            >
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!path.startsWith("/account") ? (
        mounted && width <= 475 ? (
          <SmallSearchBar />
        ) : (
          <FullSearchBar />
        )
      ) : (
        <TopHeader />
      )}

      {isAuthenticated === "authenticated" && !path.startsWith("/account") ? (
        <div className="flex items-center justify-center gap-2">
          <MessageCircleMore size={22} strokeWidth={1.9} className="cursor-pointer"/>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="px-2 py-0">
              <Button variant="outline" className="rounded-3xl cursor-pointer">
                Create <Plus size={20} className="lucid-icons" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Create content</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-6 cursor-pointer">
                  <Upload />
                  <span>Upload video</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="gap-6 cursor-pointer" disabled>
                  <Video />
                  <span>Upload shorts</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="gap-6 cursor-pointer" disabled>
                  <StickyNote />
                  <span>Create community post</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-3 justify-center">
            <Bell size={20} className="lucid-icons" />
          </div>
        </div>
      ) : (
        !isAuthenticated && (
          <Link href={ROUTES.PAGES_ROUTES.SIGN_IN}>
            <Button className="w-full cursor-pointer rounded-2xl h-8 bg-transparent border-[1px] border-blue-400 text-blue-400 hover:bg-transparent hover:shadow-blue-300">
              Sign in
            </Button>
          </Link>
        )
      )}
    </header>
  );
};

export default Header;
