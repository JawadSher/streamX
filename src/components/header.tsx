"use client";

import React from "react";
import { Button } from "./ui/button";
import { Link } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mic,
  Moon,
  Search,
  Sun,
  Bell,
  Plus,
  Upload,
  Video,
  StickyNote,
} from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { Input } from "@/components/ui/input";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Header = () => {
  const { setTheme } = useTheme();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <header className="sticky top-2 p-4 z-50 bg-accent h-16 flex items-center px-4 border-b w-full mx-auto rounded-lg">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
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
      <div className="flex grow mx-2 items-center justify-center">
        <div className="relative md:max-w-[800px] grow">
          <Input className="rounded-3xl w-full pr-10" placeholder="Search" />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            color="gray"
          />
        </div>
        <Mic className="ml-1 cursor-pointer" color="gray" />
      </div>
      {isAuthenticated === "authenticated" ? (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-3xl cursor-pointer">
                Create <Plus size={26} />
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
                <DropdownMenuItem className="gap-6 cursor-pointer">
                  <Video />
                  <span>Upload shorts</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-6 cursor-pointer">
                  <StickyNote />
                  <span>Create community post</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <Bell className="cursor-pointer" />
          </div>
        </div>
      ) : (
        <Link href="/sign-in">
          <Button className="w-full flex grow cursor-pointer rounded-2xl h-8 bg-transparent border-[1px] border-blue-400 text-blue-400 hover:bg-transparent hover:shadow-blue-600">
            Sign in
          </Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
