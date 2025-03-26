"use client";

import VideoCard from "@/components/video-card";
import { imagePaths } from "@/lib/ImagePaths";


const Home = () => {
  const URL = imagePaths.videoThumbnail;
  
  return (
    <div className="grid gap-x-2 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 25 }).map((_, i) => (
        <VideoCard
          key={i}
          views="1234"
          url={URL}
          title={`New Video ${i + 1}`}
          channelName="Sample Channel"
        />
      ))}
    </div>
  );
};

export default Home;
