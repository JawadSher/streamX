import { map } from "zod";
import Container from "./container";
import VideoCard from "../video-card";
import Link from "next/link";

interface Props {
  videos?: string[];
  videoThumbnails?: string[];
}

const History = ({ videos, videoThumbnails }: Props) => {
  return (
    <Container className="flex flex-col gap-2">
  <h1 className="font-bold text-[20px]">History</h1>

  <div className="relative">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-fit">
      <VideoCard url="" className="h-[140px] w-full md:w-[250px]" />
      <VideoCard url="" className="h-[140px] w-full md:w-[250px]" />
      <VideoCard url="" className="h-[140px] w-full md:w-[250px]" />
      <VideoCard url="" className="h-[140px] w-full md:w-[250px]" />
      <VideoCard url="" className="h-[140px] w-full md:w-[250px]" />
    </div>

    <Link
      href="/history"
      className="absolute top-12 right-40 bg-zinc-800 hover:bg-zinc-700 transition flex items-center rounded-4xl p-1"
    >
      <span className="material-symbols-rounded">arrow_right_alt</span>
    </Link>
  </div>
</Container>

  );
};

export default History;
