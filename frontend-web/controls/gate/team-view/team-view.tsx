import teamApi from "@/api/team-api";
import { useQuery } from "@tanstack/react-query";
import channelApi from "@/api/channel-api";
import { Calendar, Megaphone, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import ChannelButton from "./channel-button";
import ChannelAddModal from "./channel-add-modal";
import { useModalDelayClose } from "@/components/modal-delay-close.hook";

interface TeamViewProps {
  teamId?: string | null;
  channelId?: string | null;
}

export default function TeamView(props: TeamViewProps) {
  const { teamId, channelId } = props;

  const {
    isModalOpen: isOpenChannelAddModal,
    setIsModalOpen: setIsOpenChannelAddModal,
    isModalMounted: isChannelModalMounted
  } = useModalDelayClose();

  const { data: team } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const response = await teamApi.getTeamByTeamId(teamId!);
      if (!response.success) {
        throw new Error(response.errorCode || 'Failed to fetch team');
      }
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!teamId,
  });

  const { data: channels } = useQuery({
    queryKey: ['channels', teamId],
    queryFn: async () => {
      const response = await channelApi.getChannelsByTeamId(teamId!);
      if (!response.success) {
        throw new Error(response.errorCode || 'Failed to fetch channels');
      }
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!teamId,
  });

  if (!team) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Team Header */}
      <div className="h-12 border-b border-[#E5E7EB] flex items-center justify-between px-4 bg-white">
        <h2 className="text-gray-800 font-semibold truncate">{team?.name}</h2>
        <button
          onClick={() => setIsOpenChannelAddModal(true)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#374151] transition-colors duration-150 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Common Menus */}
        <div className="p-2 space-y-0.5">
          <button
            className={cn(
              "w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition-colors duration-150 group cursor-pointer",
              false
                ? "bg-[#8B5CF6] text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
            )}
          >
            <Megaphone className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">공지사항</span>
          </button>
          <button
            className={cn(
              "w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition-colors duration-150 group cursor-pointer",
              false
                ? "bg-[#8B5CF6] text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
            )}
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">이벤트</span>
          </button>
          <button
            className={cn(
              "w-full flex items-center space-x-2 px-2 py-1.5 rounded text-sm transition-colors duration-150 group cursor-pointer",
              false
                ? "bg-[#8B5CF6] text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
            )}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">멤버 목록</span>
          </button>
        </div>

        <div className="mx-4 border-b border-[#E5E7EB]"></div>

        {/* Channels List */}
        <div className="p-2 space-y-0.5">
          {channels?.map(channel => (
            <ChannelButton key={channel.channelId} channel={channel} active={channel.channelId === channelId} />
          ))}
        </div>
      </div>

      {(team && isChannelModalMounted) && (
        <ChannelAddModal
          teamId={team.teamId}
          isOpen={isOpenChannelAddModal}
          onOpenChange={(changed: boolean) => setIsOpenChannelAddModal(changed)}
        />
      )}
    </div>
  )
}