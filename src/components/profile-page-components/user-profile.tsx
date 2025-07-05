"use client";

import { Button } from "../ui/button";
import { UserAvatar } from "../user-avatar";
import Container from "./container";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  fullName?: string | null;
  userName?: string | null;
  avatarURL: string;
}

const UserProfile = ({ fullName, userName, avatarURL }: Props) => {
  return (
    <Container className="gap-2 items-center">
      <UserAvatar avatarURL={avatarURL} />

      <div className="flex flex-col flex-wrap gap-3  ">
        <div>
          <h1 className="text-3xl font-bold dark:text-gray-200 text-gray-700">
            {fullName || "Unknown"}
          </h1>
          <h3 className="font-normal dark:text-gray-400 text-gray-700">
            {userName || "@unknown"}
          </h3>
        </div>

        {/* <Form action={xxxxxxx}> */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="cursor-pointer flex items-center gap-1 px-3 rounded-3xl w-fit h-[25px] font-normal text-sm overflow-clip dark:bg-zinc-800 dark:text-gray-200 relative">
                Switch Account
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* </Form> */}
      </div>
    </Container>
  );
};

export default UserProfile;
