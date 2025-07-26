import { ChannelDto } from "@/api/generated";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";
import Link from "next/link";

interface ChannelButtonProps {
  channel: ChannelDto;
  active?: boolean;
  onClick?: (channel: ChannelDto) => void;
}

export default function ChannelButton(props: ChannelButtonProps) {
  const { channel, active, onClick } = props;

  return (
    <Link href={`/gate/${channel.teamId}/${channel.channelId}`} className="flex">
      <button
        onClick={() => onClick?.(channel)}
        className={cn(
          "w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition-colors duration-150 group cursor-pointer",
          active
            ? "bg-[#8B5CF6] text-white"
            : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
        )}
      >
        <Hash className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{channel.name}</span>
      </button>
    </Link>
  )
}