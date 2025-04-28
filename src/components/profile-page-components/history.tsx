import Container from "./container";
import VideoCard from "../video-card/video-card";
import Link from "next/link";
import { API_ROUTES } from "@/lib/api/ApiRoutes";

interface Props {
  videos?: string[];
  videoThumbnails?: string[];
}

const History = ({ videos = [], videoThumbnails = [] }: Props) => {
  // const isEmpty = videos.length === 0;
  const isEmpty = 1;
  console.log(videos, videoThumbnails)
  
  return (
    <Container className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">History</h1>
        <p className="text-[14px] text-zinc-400">
          Want to revisit your previously watched content?
          <Link href={API_ROUTES.HISTORY} className="text-blue-500 ml-1 hover:underline">
            click here
          </Link>
        </p>
      </div>

      <div className="relative">
        {!isEmpty ? (
          <p className="text-gray-500">No videos in history yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-fit">
            {/* {videos.map((videoUrl, index) => (
              <VideoCard
                key={index}
                url={videoUrl}
                // thumbnail={videoThumbnails[index]}
                className="h-[140px] w-[250px]"
              />
            ))} */}

            {Array.from({ length: 6 }).map((_, index) => (
              <VideoCard key={index} url="" className="h-[140px] w-[250px] " />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default History;
