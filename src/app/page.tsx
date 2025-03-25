"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import VideoCard from "@/components/video-card";
import { useSession } from "next-auth/react";
import { imagePaths } from "@/lib/ImagePaths";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const { setTheme } = useTheme();
  const URL = imagePaths.videoThumbnail;
  const { data: session, status, update } = useSession({
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
  
  useEffect(() => {
    if (status === "unauthenticated" && hasUpdated) {
      router.push("/sign-in");
    }
  }, [status, hasUpdated, router]);

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

        <div className="flex-1 flex flex-col h-screen px-4 overflow-auto">
          <header className="sticky top-2 p-4 z-50 bg-accent h-16 flex items-center px-4 border-b w-full mx-auto rounded-lg">
            <div className="flex items-center gap-3 w-full">
              <SidebarTrigger className="-ml-1" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 py-4 mx-auto w-full max-w-screen-2xl">
            {status === "authenticated" ? (
              <div className="grid gap-x-2 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
            ) : (
              <div className="flex items-center justify-center h-[205px]">
                <h1 className="text-2xl">Login First</h1>
              </div>
            )}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Home;