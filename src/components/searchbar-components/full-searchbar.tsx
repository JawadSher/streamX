"use client";

import { Mic, Search } from "lucide-react";
import { Input } from "../ui/input";

function FullSearchBar() {
  return (
    <div className="flex grow mx-2 items-center justify-center">
      <div className="*:not-first:mt-2 w-[50%]">
        <div className="relative flex rounded-2xl shadow-xs">
          <Input
            className="-me-px rounded-e-none rounded-l-2xl ps-6 shadow-none font-semibold text-[20px]"
            placeholder="Search here"
            type="text"
          />
          <span className="border-input text-muted-foreground -z-10 inline-flex items-center rounded-e-2xl border px-3 text-sm">
            <Search />
          </span>
        </div>
      </div>
      <Mic size={20} className="lucid-icons ml-1" />
    </div>
  );
}

export default FullSearchBar;
