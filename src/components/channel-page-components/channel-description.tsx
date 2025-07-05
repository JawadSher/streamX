"use client";

import useWindowWidth from "@/hooks/useWindowWidth";
import ChannelAboutMore from "./channel-about-more";
import UserLinks from "./user-links";

function ChannelDescription({
  className = "",
  description = "A channel dedicated to chai and coding in HINDI. A lot happens over chai and I am a big",
}: {
  className?: string;
  description?: string;
}) {
  const width = useWindowWidth();

  const getDescriptionWidthClass = () => {
    if (width === 0) return null;
    if (width < 640) return "max-w-[100px]";
    if (width < 768) return "max-w-[150px]";
    if (width < 1024) return "max-w-[200px]";
    if (width < 1280) return "max-w-[380px]";
    if (width < 1395) return "max-w-[450px]";
    return "max-w-[600px]";
  };

  return (
    <div className="flex flex-col items-start gap-1 w-full">
      <div className={`flex items-center ${className} w-full`}>
        <h3
          className={`text-zinc-400 font-normal text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis
                      ${getDescriptionWidthClass()} relative 
                      dark:after:content-[''] dark:after:absolute dark:after:inset-y-0 dark:after:right-0
                      dark:after:w-[10%] dark:after:max-w-[40px] dark:after:min-w-[20px]
                      dark:after:bg-gradient-to-l dark:after:from-[#1f1f23aa] dark:after:to-transparent
                      dark:after:pointer-events-none dark:after:rounded-r-full w-full`}
        >
          {description}
        </h3>
        <ChannelAboutMore />
      </div>
      <UserLinks />
    </div>
  );
}

export default ChannelDescription;
