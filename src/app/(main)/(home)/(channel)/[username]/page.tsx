import ChannelHeader from "@/components/channel-page-components/channel-header";
import { Separator } from "@/components/ui/separator";

function UserChannel() {
  return (
    <div className="w-full h-full pb-2">
      <div className="flex flex-col w-full h-full dark:bg-[#18181B] rounded-2xl p-4">
        <ChannelHeader />
        <Separator />
      </div>
    </div>
  );
}

export default UserChannel;
