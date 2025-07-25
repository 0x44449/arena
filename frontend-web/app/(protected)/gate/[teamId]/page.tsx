'use client';

import teamApi from "@/api/team-api";
import { useQuery } from "@tanstack/react-query";
import { Hash } from "lucide-react";
import { useParams } from "next/navigation";

export default function Page() {
  return (
    <div className="flex flex-1 bg-white">MAIN WW</div>
  )
  // const { teamId } = useParams<{ teamId: string }>();

  // const { data: team } = useQuery({
  //   queryKey: ['team', teamId],
  //   queryFn: async () => {
  //     const response = await teamApi.getTeamByTeamId(teamId!);
  //     if (!response.success) {
  //       throw new Error(response.errorCode || 'Failed to fetch team');
  //     }
  //     return response.data;
  //   },
  //   staleTime: Infinity,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  // });

  // if (!team) {
  //   return <div className="flex flex-1 bg-white"></div>;
  // }

  // return (
  //   <div className="flex-1 bg-white flex flex-col">
  //     <div className="px-6 pt-4 pb-2 bg-white">
  //       <div className="flex items-center space-x-3">
  //         {currentChannel?.type === 'voice' ? (
  //           <span className="text-[#8B5CF6] text-lg">🔊</span>
  //         ) : (
  //           <Hash className="w-5 h-5 text-[#8B5CF6]" />
  //         )}
  //         <div>
  //           <h3 className="text-gray-800 font-semibold">
  //             {team.name || activeChannelId}
  //           </h3>
  //           {currentChannel?.description && (
  //             <p className="text-[#6B7280] text-sm mt-0.5">
  //               {currentChannel.description}
  //             </p>
  //           )}
  //         </div>
  //       </div>
  //       <div className="mt-2 h-px bg-gradient-to-r from-[#E5E7EB] to-transparent"></div>
  //     </div>

  //     <div className="flex-1 flex items-center justify-center px-6">
  //       <div className="text-center">
  //         <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
  //           {currentChannel?.type === 'voice' ? (
  //             <span className="text-2xl">🔊</span>
  //           ) : (
  //             <Hash className="w-8 h-8 text-white" />
  //           )}
  //         </div>
  //         <h2 className="text-gray-800 text-xl font-semibold mb-2">
  //           {currentChannel?.type === 'voice' ? `🔊 ${currentChannel.name}` : `#${currentChannel?.name || activeChannelId}`}
  //         </h2>
  //         <p className="text-[#6B7280] max-w-md">
  //           {currentChannel?.description ||
  //             `${currentServer?.name || 'Arena 메신저'}의 ${currentChannel?.name || activeChannelId} 채널입니다.`}
  //           <br />
  //           {currentChannel?.type === 'voice'
  //             ? '음성 채팅을 시작하려면 참가 버튼을 클릭하세요.'
  //             : '좌측 채널 목록에서 다른 채널을 선택하거나 새로운 채널을 만들어보세요.'
  //           }
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // )
}