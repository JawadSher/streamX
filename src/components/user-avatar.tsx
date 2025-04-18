import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  avatarURL: string;
  fullName?: string;
}

export async function UserAvatar({ avatarURL, fullName }: Props) {
  return (
    <Avatar className="w-30 h-30">
      <AvatarImage src={avatarURL} alt="avatar" />
      <AvatarFallback>
        {fullName?.split(" ")[0][0] || ""}
        {fullName?.split(" ")[1][0] || ""}
      </AvatarFallback>
    </Avatar>
  );
}
