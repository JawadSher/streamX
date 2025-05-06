"use client";

import { ReactNode } from "react";

interface TotalSubscribersProps {
  totalVideos?: number;
}

function TotalVideos({  totalVideos = 100 }: TotalSubscribersProps) {
  const formatVideos = (videos: number): string => {
    if (videos >= 1_000_000) {
      return `${(videos / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (videos >= 1_000) {
      return `${(videos / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return videos.toString();
  };

  const displayValue: ReactNode =
    typeof totalVideos === "number" && !isNaN(totalVideos)
      ? formatVideos(totalVideos)
      : formatVideos(100);

  return (
    <div className="flex gap-1 items-center dark:text-zinc-400">
      <h4>{displayValue}</h4>
      <h3 className="text-sm font-normal">videos</h3>
    </div>
  );
}

export default TotalVideos;
