"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { progressManager } from "@/components/progress-bar/progress-manager";
import ProgressBar from "./progress-bar";

export default function ProgressWrapper() {
  const [progressState, setProgressState] = useState({
    isLoading: false,
    progress: 0,
  });
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = progressManager.subscribe(setProgressState);
    progressManager.startProgress();

    const timeout = setTimeout(() => {
      progressManager.finishProgress();
    }, 1000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <ProgressBar
      isLoading={progressState.isLoading}
      progress={progressState.progress}
    />
  );
}