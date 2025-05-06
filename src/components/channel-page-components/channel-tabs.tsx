"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ChannelTabs() {

  return (
    <Tabs defaultValue="account" className="max-w-[500px]">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger className="cursor-pointer" value="Home">Home</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="Videos">Videos</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="Shorts">Shorts</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="Playlists">Playlists</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="Posts">Posts</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default ChannelTabs;
