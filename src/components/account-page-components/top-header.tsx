import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";
import { API_ROUTES } from "@/lib/api/ApiRoutes";

const TopHeader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <nav className="flex w-8/9 items-center justify-start gap-2 sm:gap-4 overflow-hidden">
        <Tabs defaultValue="account" className="w-full h-full">
          <TabsList className="flex items-center justify-start w-full h-full">
            <Link href={API_ROUTES.ACCOUNT}>
              <TabsTrigger
                className="cursor-pointer max-w-fit px-6"
                value="account"
              >
                Account
              </TabsTrigger>
            </Link>

            <Link href={API_ROUTES.ACCOUNT_SECURITY}>
              <TabsTrigger
                className="cursor-pointer max-w-fit px-6"
                value="security"
              >
                Security
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </nav>
    </div>
  );
};

export default TopHeader;
