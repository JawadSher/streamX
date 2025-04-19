import Image from "next/image";

interface Props {
  avatarURL: string;
  fullName?: string | null;
}

export async function UserAvatar({ avatarURL, fullName }: Props) {

  return (
    <div className="rounded-full border-2 border-zinc-400 p-1">
      <Image src={avatarURL} width={100} height={100} alt="logo" quality={75} className="rounded-full"/>
    </div>
  );
}
