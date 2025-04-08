"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Loader2 } from "lucide-react";

import { usePathname } from "next/navigation";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Header from "@/components/header";

const layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const isShortsPage = pathname.startsWith("/shorts/");

  if (isAuthenticated === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white-100">
      <SidebarProvider>
        <AppSidebar sessionStatus={isAuthenticated} />

        <div
          className={`flex-1 flex flex-col h-screen px-2 pl-2 md:pl-4 ${
            isShortsPage ? "overflow-hidden" : "overflow-auto custom-scroll-bar"
          }`}
        >
          <Header isAuthenticated={isAuthenticated} />
          
          <main className="flex-1 mx-auto w-full mt-3">{children}</main>

        </div>
      </SidebarProvider>
    </div>
  );
};

export default layout;
