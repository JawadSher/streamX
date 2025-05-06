"use client";

import { ReactNode } from "react";

interface TotalSubscribersProps {
  totalSubs?: number;
}

function TotalSubscribers({
  totalSubs = 100,
}: TotalSubscribersProps) {
  const formatSubscribers = (subs: number): string => {
    if (subs >= 1_000_000_000) {
      return `${(subs / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    }
    if (subs >= 1_000_000) {
      return `${(subs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (subs >= 1_000) {
      return `${(subs / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return subs.toString();
  };

  const displayValue: ReactNode =
    typeof totalSubs === "number" && !isNaN(totalSubs)
      ? formatSubscribers(totalSubs)
      : formatSubscribers(100);

  return (
    <div className="flex gap-1 items-center dark:text-zinc-400">
      <h4>{displayValue}</h4>
      <h3 className="text-sm font-normal">subscribers</h3>
    </div>
  );
}

export default TotalSubscribers;
