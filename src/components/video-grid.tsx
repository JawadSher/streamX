"use client";

// import VideoCard from "@/components/video-card";
// import { RootState } from "@/store/store";
// import { useSelector } from "react-redux";

export default function VideoGrid({
  // videos,
  // defaultThumbnail,
}: {
  videos: string;
  defaultThumbnail: string;
}) {

  return (
    <div className="grid gap-x-2 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {/* {videos.map((video: any, i: number) => (
        <VideoCard
          key={i}
          views={video.views || "1234"}
          url={video.thumbnail || defaultThumbnail}
          title={video.title || `New Video ${i + 1}`}
          channelName={video.channelName || "Sample Channel"}
        />
      ))} */}
    </div>
  );
}