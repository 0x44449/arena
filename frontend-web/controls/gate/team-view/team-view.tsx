import teamApi from "@/api/team-api";
import { useQuery } from "@tanstack/react-query";
import workspaceApi from "@/api/workspace-api";
import { Calendar, Megaphone, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import WorkspaceButton from "./workspace-button";
import WorkspaceAddModal from "./workspace-add-modal";
import { useModalDelayClose } from "@/components/modal-delay-close.hook";

interface TeamViewProps {
  teamId?: string | null;
  workspaceId?: string | null;
}

export default function TeamView(props: TeamViewProps) {
  const { teamId, workspaceId } = props;

  const {
    isModalOpen: isOpenWorkspaceAddModal,
    setIsModalOpen: setIsOpenWorkspaceAddModal,
    isModalMounted: isWorkspaceModalMounted
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

  const { data: workspaces } = useQuery({
    queryKey: ['workspaces', teamId],
    queryFn: async () => {
      const response = await workspaceApi.getWorkspacesByTeamId(teamId!);
      if (!response.success) {
        throw new Error(response.errorCode || 'Failed to fetch workspaces');
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
          onClick={() => setIsOpenWorkspaceAddModal(true)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#374151] transition-colors duration-150 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Common Menus */}
        <div className="p-2">
          <div className="space-y-0.5">
            <button
              className={cn(
                "w-full flex items-center space-x-3 px-2 py-1.5 rounded text-sm transition-colors duration-150 cursor-pointer",
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
                "w-full flex items-center space-x-3 px-2 py-1.5 rounded text-sm transition-colors duration-150 cursor-pointer",
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
                "w-full flex items-center space-x-3 px-2 py-1.5 rounded text-sm transition-colors duration-150 cursor-pointer",
                false
                  ? "bg-[#8B5CF6] text-white"
                  : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
              )}
            >
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">멤버 목록</span>
            </button>
          </div>
        </div>

        <div className="mx-4 border-b border-[#E5E7EB]"></div>

        {workspaces?.map(workspace => (
          <WorkspaceButton key={workspace.workspaceId} workspace={workspace} active={workspace.workspaceId === workspaceId} />
        ))}
      </div>

      {(team && isWorkspaceModalMounted) && (
        <WorkspaceAddModal
          teamId={team.teamId}
          isOpen={isOpenWorkspaceAddModal}
          onOpenChange={(changed: boolean) => setIsOpenWorkspaceAddModal(changed)}
        />
      )}
    </div>
  )
}