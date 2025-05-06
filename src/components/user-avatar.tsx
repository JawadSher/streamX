"use client";

import Image from "next/image";

interface Props {
  avatarURL: string; 
  width?: number;
  height?: number;
  quality?: number;
}

export function UserAvatar({
  avatarURL,
  width = 100,
  height = 100,
  quality = 75,
}: Props) {
  return (
    <div className="rounded-full border-2 border-zinc-400 p-[2px] w-fit h-fit max-w-[150px] max-h-[150px] overflow-clip">
      <Image
        src={avatarURL}
        width={width}
        height={height}
        alt="User Avatar"
        quality={quality}
        className="rounded-full"
      />
    </div>
  );
}
