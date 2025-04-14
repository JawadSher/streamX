'use client';

import React from "react";
import {
    SidebarHeader,
  } from "@/components/ui/sidebar";

const SideBarTop = ({state}: {state: string}) => {
  return (
    <SidebarHeader className="p-4 border-b">
      <h1 className="text-4xl font-mono text-center transition-all duration-200">
        {state === "expanded" ? "streamX" : "X"}
      </h1>
    </SidebarHeader>
  );
};

export default SideBarTop;
