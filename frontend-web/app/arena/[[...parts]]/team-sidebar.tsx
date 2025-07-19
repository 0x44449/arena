'use client';

import { useQuery } from "@tanstack/react-query";
import { useArenaPath } from "./arena-path.hook";
import teamApi from "@/api/team-api";
import TeamSidebarButton from "./team-sidebar-button";
import TeamAddButton from "./team-add-button";

export default function TeamSidebar() {
  const { teamId } = useArenaPath();
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamApi.getTeams();
      if (!response.success) {
        throw new Error(response.errorCode || 'Failed to fetch teams');
      }
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <div className="w-[72px] flex flex-col items-center py-3 space-y-2 border-r border-[#E5E7EB]">
      {teams?.map(team => (
        <TeamSidebarButton key={team.teamId} team={team} active={team.teamId === teamId} />
      ))}

      <TeamAddButton />
    </div>
  )
}