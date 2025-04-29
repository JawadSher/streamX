"use client";

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
import { Mic, MoveUpLeft, Search, X } from "lucide-react";

function SmallSearhBar() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchState, setSearchState] = useState<boolean>(false);

  return (
    <div className="flex grow mx-2 items-center justify-center ">
      <div className="relative md:max-w-[800px] grow">
        <Dialog open={searchState}>
          <DialogTrigger asChild onClick={() => setSearchState(true)}>
            <Search
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 lucid-icons`}
            />
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
                <X size={24} strokeWidth={4} className="lucid-icons" />
              </Button>
              <Input
                id="username"
                value={searchInput}
                className="border-none rounded-4xl h-8"
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Mic size={24} className="lucid-icons" />
            </div>

            <div className="w-full px-2 bg-zinc-900 rounded-2xl">
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <MoveUpLeft size={24} className="lucid-icons" />
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <MoveUpLeft size={24} className="lucid-icons" />
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <MoveUpLeft size={24} className="lucid-icons" />
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <MoveUpLeft size={24} className="lucid-icons" />
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <MoveUpLeft size={24} className="lucid-icons" />
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <MoveUpLeft size={24} className="lucid-icons" />
              </div>
              <Separator />
              <div className="flex rounded-2xl  px-2 py-1 items-center justify-between">
                <span className="w-full text-zinc-200 text-md">computer</span>
                <MoveUpLeft size={24} className="lucid-icons" />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Mic size={24} className="lucid-icons" />
    </div>
  );
}

export default SmallSearhBar;
