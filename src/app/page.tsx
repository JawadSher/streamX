"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
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
import { useTheme } from "next-themes";
import VideoCard from "@/components/video-card";
import { useSession } from "next-auth/react";
import { imagePaths } from "@/lib/ImagePaths";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Home = () => {
  const { setTheme } = useTheme();
  const URL = imagePaths.videoThumbnail;
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: false,
    onUnauthenticated: () => {},
  });

  const router = useRouter();
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => {
    if (status === "loading" || hasUpdated) return;

    if (status === "unauthenticated" && !session) {
      update().then(() => setHasUpdated(true));
    }
  }, [status, session, update, hasUpdated]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white-100">
      <SidebarProvider>
        <AppSidebar data={session?.user} sessionStatus={status} />

        <div className="flex-1 flex flex-col h-screen px-2 pl-2 md:pl-4 overflow-auto custom-scroll-bar">

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
            <div className="flex grow mx-2 items-center  justify-center">
              <div className="relative md:max-w-[800px] grow ">
                <Input
                  className="rounded-3xl w-full pr-10 "
                  placeholder="Search"
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  color="gray"
                />
              </div>
              <Mic className="ml-1 cursor-pointer" color="gray" />
            </div>
            {status === "authenticated" ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-3xl cursor-pointer"
                    >
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

          <main className="flex-1 py-4 mx-auto w-full">
            <div className="grid gap-x-2 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
              {Array.from({ length: 25 }).map((_, i) => (
                <VideoCard
                  key={i}
                  views="1234"
                  url={URL}
                  title={`New Video ${i + 1}`}
                  channelName="Sample Channel"
                />
              ))}
            </div>
          </main>
          
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Home;
