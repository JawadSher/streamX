"use client";

import Image from "next/legacy/image";
import { useState } from "react";
import { imagePaths } from "@/lib/ImagePaths";
import SelectBannerImage from "./select-Banner-Image";

function UserChannelBanner({
  className,
  bannerImage,
}: {
  className?: string;
  bannerImage?: string;
}) {
  const [bannerImg, setBannerImg] = useState<string | null>(
    bannerImage || imagePaths.defaultBanner
  );

  setBannerImg(null);
  return (
    <div
      className={`relative w-full h-40 md:h-40 lg:h-50 bg-cover bg-center border-1 overflow-hidden ${className} border-none`}
    >
      {bannerImg && (
        <Image
          src={bannerImg}
          alt="Banner Image"
          layout="fill"
          objectFit="cover"
        />
      )}
      {!bannerImage && (
        <SelectBannerImage className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
      )}
    </div>
  );
}

export default UserChannelBanner;
