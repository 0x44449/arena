import teamApi from "@/api/team-api";
import channelApi from "@/api/channel-api";
import { useQuery } from "@tanstack/react-query";
import { Hash } from "lucide-react";

interface ChannelViewProps {
  teamId: string;
  channelId: string;
  children?: React.ReactNode;
}

export default function ChannelView(props: ChannelViewProps) {
  const { teamId, channelId, children } = props;

  const { data: team } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const response = await teamApi.getTeamByTeamId(teamId);
      if (!response.success) {
        throw new Error(response.errorCode || 'Failed to fetch team');
      }
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: channel } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      const response = await channelApi.getChannelByChannelId(channelId);
      if (!response.success) {
        throw new Error(response.errorCode || 'Failed to fetch channel');
      }
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (!team || !channel) {
    return <div className="flex flex-1 bg-white"></div>;
  }

  return (
    <div className="flex flex-1 flex-col bg-white min-h-0 min-w-0">
      <div className="px-6 pt-4 pb-2 bg-white">
        <div className="flex items-center space-x-3">
          {/* {currentChannel?.type === 'voice' ? (
            <span className="text-[#8B5CF6] text-lg">🔊</span>
          ) : (
            <Hash className="w-5 h-5 text-[#8B5CF6]" />
          )} */}
          <Hash className="w-5 h-5 text-[#8B5CF6]" />
          <div>
            <h3 className="text-gray-800 font-semibold">
              {channel.name}
            </h3>
            {channel.description && (
              <p className="text-[#6B7280] text-sm mt-0.5">
                {channel.description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-2 h-px bg-gradient-to-r from-[#E5E7EB] to-transparent"></div>
      </div>

      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        {children}
      </div>
    </div>
  );
}