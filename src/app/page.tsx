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
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import VideoCard from "@/components/video-card";

const Home = () => {
  const { setTheme } = useTheme();
  const URL =
    "https://unsplash.com/photos/dramatic-mountains-under-a-cloudy-moody-sky-9DyNN_Yz2yk";

  return (
    <div className="h-screen flex bg-white-100">
      <SidebarProvider>
        <AppSidebar />

        <div className="flex-1 flex flex-col h-screen relative px-4 overflow-auto">
          <header className="sticky top-2 p-4 z-50  backdrop-blur-sm shadow-sm h-16 flex items-center px-4 border-b w-full mx-auto rounded-lg">
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

          <main className="flex-1 py-4 mx-auto">
            <div className="w-full">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <VideoCard
                    key={i}
                    views="1234"
                    url="https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=500&h=300&fit=crop"
                    title={`New Video ${i + 1}`}
                    channelName="Sample Channel"
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Home;
