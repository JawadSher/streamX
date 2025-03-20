"use client";

import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type CardProps = {
  title?: string;
  channelName?: string;
  views?: string;
  url: string;
};

const VideoCard = ({ title, channelName, views, url }: CardProps) => {
  return (
    <Card className="rounded-lg overflow-hidden shadow-md min-h-[290px] 
    min-w-[290px] bg-gray-900 text-white p-0 gap-0 cursor-pointer hover:shadow-slate-500">
      <div className="relative w-full h-[250px]">
        <Image
          src={url}
          alt="Thumbnail"
          fill
          className="object-cover object-center block"
          priority={false}
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-2 bg-black relative">
        <CardHeader className="p-0 leading-none">
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-0 mt-1 flex flex-col items-start text-sm text-gray-400">
          <span className="font-medium">{channelName}</span>
          <span>{views} views</span>
        </CardFooter>
      </div>
    </Card>
  );
};

export default VideoCard;
