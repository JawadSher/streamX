"use client";

import { cssUnfillProperty } from "@/constants/navConfig";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { Separator } from "../ui/separator";

function SmallSearhBar() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchState, setSearchState] = useState<boolean>(false);

  return (
    <div className="flex grow mx-2 items-center justify-center ">
      <div className="relative md:max-w-[800px] grow">
        <Dialog open={searchState}>
          <DialogTrigger asChild onClick={() => setSearchState(true)}>
            <span
              className={`${cssUnfillProperty} absolute right-3 top-1/2 transform -translate-y-1/2`}
            >
              search
            </span>
          </DialogTrigger>
          <DialogTitle className="hidden">Search bar</DialogTitle>
          <DialogContent
            className="sm:w-full [&>button]:hidden p-0 h-fit top-38 border-none pt-2 flex flex-col items-center gap-5"
            title="search"
          >
            <div className="flex items-center w-full justify-between px-1 gap-1">
              <Button
                className="hover:bg-transparent p-0 m-0 bg-transparent text-gray-300"
                onClick={(prev) => setSearchState(!prev)}
              >
                <span className={`${cssUnfillProperty}`}>close</span>
              </Button>
              <Input
                id="username"
                value={searchInput}
                className="border-none rounded-4xl h-8"
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <span className={`${cssUnfillProperty}`}>mic</span>
            </div>

            <div className="w-full px-2 bg-zinc-900 rounded-2xl">
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <span className={`${cssUnfillProperty}`}>north_west</span>
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <span className={`${cssUnfillProperty}`}>north_west</span>
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <span className={`${cssUnfillProperty}`}>north_west</span>
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <span className={`${cssUnfillProperty}`}>north_west</span>
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <span className={`${cssUnfillProperty}`}>north_west</span>
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <span className={`${cssUnfillProperty}`}>north_west</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <span className={`${cssUnfillProperty} cursor-pointer`}>mic</span>
    </div>
  );
}

export default SmallSearhBar;
