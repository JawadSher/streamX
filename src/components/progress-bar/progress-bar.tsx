"use client";

import { Progress } from "../ui/progress";

export type ProgressState = {
  isLoading: boolean;
  progress: number;
};

export const ProgressBar = ({ isLoading, progress }: ProgressState) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {isLoading && (
        <Progress
          value={progress}
          className="h-1"
        />
      )}
    </div>
  );
};

export default ProgressBar;