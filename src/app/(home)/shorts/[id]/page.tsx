"use client"

import { useParams } from "next/navigation";

const Shorts = () => {
  const params = useParams<{ id: string }>()
  
    return (
        <div className="w-full h-[calc(100vh-95px)] mt-2 flex items-center justify-center overflow-hidden">
          <video
            className="w-full max-w-[540px] mx-auto aspect-[9/16] object-cover"
            // src={video.url}
            autoPlay
            loop
            muted
          />
        </div>
    );
}

export default Shorts;