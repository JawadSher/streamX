import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TopHeader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <nav className="flex w-8/9 items-center justify-start gap-2 sm:gap-4 overflow-hidden">
        <Tabs defaultValue="account" className="w-full h-full">
          <TabsList className="flex items-center justify-start w-full h-full">
            <TabsTrigger
              className="cursor-pointer max-w-fit px-6"
              value="account"
            >
              Account
            </TabsTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <TabsTrigger
                      disabled
                      className="cursor-not-allowed max-w-fit px-6 opacity-50"
                      value="security"
                    >
                      Security
                    </TabsTrigger>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsList>
        </Tabs>
      </nav>
    </div>
  );
};

export default TopHeader;