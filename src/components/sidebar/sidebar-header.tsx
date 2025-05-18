'use client';

import React from "react";
import {
    SidebarHeader,
  } from "@/components/ui/sidebar";
import Link from "next/link";
import { ROUTES } from "@/lib/api/ApiRoutes";

const SideBarTop = ({state}: {state: string}) => {
  return (
    <SidebarHeader className="p-3 border-b">
      <Link href={ROUTES.PAGES_ROUTES.HOME}>
        <h1 className="text-4xl font-mono text-center transition-all duration-200 hover:text-blue-400 cursor-pointer">
          {state === "expanded" ? "streamX" : "X"}
        </h1>
      </Link>
    </SidebarHeader>
  );
};

export default SideBarTop;
