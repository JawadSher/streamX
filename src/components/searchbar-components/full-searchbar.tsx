'use client';

import { Input } from "../ui/input";
import { cssUnfillProperty } from "@/constants/navConfig";

function FullSearchBar() {
  return (
    <div className="flex grow mx-2 items-center justify-center">
      <div className="relative md:max-w-[800px] grow">
        <Input className="rounded-3xl w-full pr-10" placeholder="Search" />
        <span
          className={`${cssUnfillProperty} absolute right-3 top-1/2 transform -translate-y-1/2 search`}
        >
          search
        </span>
      </div>
      <span className={`${cssUnfillProperty} ml-1 cursor-pointer`}>mic</span>
    </div>
  );
}

export default FullSearchBar;