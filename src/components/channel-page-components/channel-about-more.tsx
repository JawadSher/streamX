import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChartNoAxesCombined,
  CircleAlert,
  Globe,
  Mail,
  MapPinned,
  SquarePlay,
  UsersRound,
} from "lucide-react";

interface Props {
  channelName?: string;
  channelDescription?: string;
  email?: string;
  channelURL?: string;
  country?: string;
  joined?: string;
  totalSubs?: string;
  totalVideos?: string;
  totalViews?: string;
}

function ChannelAboutMore({
  channelName = "Unknown",
  channelDescription = "This channel is about programming tutorials and discussions over chai. Enjoy coding content in Hindi and learn with real-world examples.",
  email = "unknown@gmail.com",
  channelURL = "https://streamx-seven.vercel.app/@unknown",
  country = "India",
  joined = "2025",
  totalSubs = "249K",
  totalVideos = "422",
  totalViews = "19,224,234",
}: Props) {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-semibold text-primary dark:text-gray-200 hover:underline transition">
        more
      </DialogTrigger>

      <DialogContent className="dark:bg-[#18181b] max-w-[90vw] sm:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] p-6 rounded-xl shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-[22px] font-bold dark:text-white">
            {channelName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold dark:text-white text-zinc-800">
              Description
            </h2>
            <p className="text-sm dark:text-gray-300 leading-relaxed">
              {channelDescription}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold dark:text-white text-zinc-800">
              More Info
            </h2>
            <div className="flex items-center gap-3 text-sm dark:text-gray-200 text-zinc-700">
              <Mail size={20} strokeWidth={1.5} />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm dark:text-gray-200 text-zinc-700">
              <Globe size={20} strokeWidth={1.5} />
              <span className="truncate">{channelURL}</span>
            </div>
            <div className="flex items-center gap-3 text-sm dark:text-gray-200 text-zinc-700">
              <MapPinned size={20} strokeWidth={1.5} />
              <span>{country}</span>
            </div>
            <div className="flex items-center gap-3 text-sm dark:text-gray-200 text-zinc-700">
              <CircleAlert size={20} strokeWidth={1.5} />
              <span>Joined {joined}</span>
            </div>
            <div className="flex items-center gap-3 text-sm dark:text-gray-200 text-zinc-700">
              <UsersRound size={20} strokeWidth={1.5} />
              <span>{totalSubs} subscribers</span>
            </div>
            <div className="flex items-center gap-3 text-sm dark:text-gray-200 text-zinc-700">
              <SquarePlay size={20} strokeWidth={1.5} />
              <span>{totalVideos} videos</span>
            </div>
            <div className="flex items-center gap-3 text-sm dark:text-gray-200 text-zinc-700">
              <ChartNoAxesCombined size={20} strokeWidth={1.5} />
              <span>{totalViews} views</span>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChannelAboutMore;
