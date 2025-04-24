"use client";

import { usePathname } from "next/navigation";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useState, useEffect } from "react";
import { SidebarTrigger } from "../ui/sidebar";

const SidebarToggle = () => {
  const path = usePathname();
  const width = useWindowWidth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  if (!path.includes("/account") || (path.startsWith("/account") && width <= 767)) {
    return <SidebarTrigger className="-ml-1 cursor-pointer" />;
  }

  return null;
};

export default SidebarToggle;