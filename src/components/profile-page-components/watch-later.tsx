import Container from "./container";
import VideoCard from "../video-card/video-card";
import Link from "next/link";
import { ROUTES } from "@/constants/ApiRoutes";


const WatchLater = ({ watchLater }: { watchLater: string[] | null | undefined}) => {
  const isEmpty = watchLater && watchLater.length === 0 ? true : false;

  return (
    <Container className="flex flex-col gap-2">
      <div>
        <h1 className="text-xl font-semibold">Watch later</h1>
        <p className="text-[14px] text-zinc-400">
          Want to revisit your saved watched content?
          <Link href={ROUTES.PAGES_ROUTES.WATCH_LATER} className="text-blue-500 ml-1 hover:underline">
            click here
          </Link>
        </p>
      </div>

      <div className="relative">
        {isEmpty ? (
          <div className="w-full flex items-center justify-center border-1 rounded-2xl h-40 ">
            <p className="text-gray-500">No videos in watch later yet.</p>
          </div>
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

export default WatchLater;
