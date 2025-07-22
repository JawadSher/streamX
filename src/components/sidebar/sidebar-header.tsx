"use client";

import React from "react";
import { SidebarHeader } from "@/components/ui/sidebar";
import Link from "next/link";
import { ROUTES } from "@/constants/ApiRoutes";
import Image from "next/image";
import { imagePaths } from "@/constants/ImagePaths";

const SideBarTop = ({ state }: { state: string }) => {
  return (
    <SidebarHeader className="p-3 border-b">
      <Link
        href={ROUTES.PAGES_ROUTES.HOME}
        className="flex items-center justify-center"
      >
        <Image
          src={
            state === "expanded"
              ? imagePaths.streamxLogo
              : imagePaths.streamXLogo
          }
          alt="Logo"
          width={state === "expanded" ? 180 : 40}
          height={state === "expanded" ? 100 : 40}
        />
      </Link>
    </SidebarHeader>
  );
};

export default SideBarTop;
