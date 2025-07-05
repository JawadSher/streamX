"use client";
import { useEffect, useState, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/header";
import NetworkStatus from "@/components/network-status-components/network-status";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isOnline = useNetworkStatus();
  const [showNetworkStatus, setShowNetworkStatus] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!hasMounted.current) {
      hasMounted.current = true;

      if (!isOnline) {
        setShowNetworkStatus(true);
      }
      return;
    }

    if (!isOnline) {
      setShowNetworkStatus(true);
    } else {
      setShowNetworkStatus(true);
      timer = setTimeout(() => {
        setShowNetworkStatus(false);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [isOnline]);

  return (
    <SidebarProvider className="py-2 pr-1">
      <AppSidebar />
      <div className="flex-1 flex flex-col h-screen md:pl-2 relative ml-2 gap-2 pb-2">
        <Header />
        {showNetworkStatus && <NetworkStatus isOnline={isOnline} />}
        {children}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
