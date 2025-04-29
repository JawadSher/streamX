'use client';

import { Mic, Search } from "lucide-react";
import { Input } from "../ui/input";

function FullSearchBar() {
  return (
    <div className="flex grow mx-2 items-center justify-center">
      <div className="relative md:max-w-[800px] grow">
        <Input className="rounded-3xl w-full pr-10" placeholder="Search" />
        <Search
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 lucid-icons search`}
          size={20}
        />
      </div>
      <Mic size={20} className="lucid-icons ml-1" />
    </div>
  );
}

export default FullSearchBar;