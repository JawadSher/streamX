let progressState = { 
  isLoading: false, 
  progress: 0 
};

let listeners: ((
  state: { 
    isLoading: boolean; 
    progress: number 
  }) => void)[] = [];
  
let interval: NodeJS.Timeout | null = null;

export const progressManager = {
  startProgress: () => {
    if (progressState.isLoading) return; 
    progressState = { isLoading: true, progress: 10 };
    emitChange();

    interval = setInterval(() => {
      progressState.progress = Math.min(progressState.progress + 10, 90);
      emitChange();
      if (progressState.progress >= 90) {
        clearInterval(interval!);
        interval = null;
      }
    }, 200);
  },

  updateProgress: (value: number) => {
    progressState.progress = Math.min(value, 100);
    emitChange();
  },

  finishProgress: () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    progressState = { isLoading: false, progress: 100 };
    emitChange();
    setTimeout(() => {
      progressState = { isLoading: false, progress: 0 };
      emitChange();
    }, 300);
  },

  subscribe: (listener: (state: { isLoading: boolean; progress: number }) => void) => {
    listeners.push(listener);
    listener(progressState);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

function emitChange() {
  listeners.forEach((listener) => listener(progressState));
}