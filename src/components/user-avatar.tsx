'use client';

import Image from "next/image";

interface Props {
  avatarURL: string;
}

export function UserAvatar({ avatarURL }: Props) {

  return (
    <div className="rounded-full border-2 border-zinc-400 p-[2px]">
      <Image src={avatarURL} width={100} height={100} alt="Logo" quality={75} className="rounded-full"/>
    </div>
  );
}
