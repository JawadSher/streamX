import Container from "./container";
import VideoCard from "../video-card/video-card";
import Link from "next/link";

interface Props {
  videos?: string[];
  videoThumbnails?: string[];
}

const DislikedVideos = ({ videos = [], videoThumbnails = [] }: Props) => {
  // const isEmpty = videos.length === 0;
  const isEmpty = 1;
  console.log(videos, videoThumbnails)

  return (
    <Container className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Disliked videos</h1>
        <p className="text-[14px] text-zinc-400">
          Want to revisit your disliked watched content?
          <Link href="/disliked-videos" className="text-blue-500 ml-1 hover:underline">
            click here
          </Link>
        </p>
      </div>

      <div className="relative">
        {!isEmpty ? (
          <p className="text-gray-500">No videos in disliked yet.</p>
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

export default DislikedVideos;
