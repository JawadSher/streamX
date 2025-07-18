"use client";

import { useSession } from "next-auth/react";

const Shorts = () => {

  const { data: session } = useSession();
  console.log("[Client] Session:", session);

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

export const dynamic = 'force-static';