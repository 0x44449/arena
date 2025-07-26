import { useQuery } from "@tanstack/react-query";
import teamApi from "@/api/team-api";
import TeamButton from "./team-button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import TeamAddModal from "./team-add-modal";
import { useModalDelayClose } from "@/components/modal-delay-close.hook";

interface TeamViewProps {
  teamId?: string | null;
}

export default function TeamSidebar(props: TeamViewProps) {
  const { teamId } = props;

  const {
    isModalOpen: isOpenTeamAddModal,
    setIsModalOpen: setIsOpenTeamAddModal,
    isModalMounted: isTeamModalMounted
  } = useModalDelayClose();

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
    <div>
      <div className="w-[72px] flex flex-col items-center py-3 space-y-2 space-y-6">
        {teams?.map(team => (
          <TeamButton key={team.teamId} team={team} active={team.teamId === teamId} />
        ))}
      </div>
      <div className="w-[72px] flex flex-col items-center py-3 space-y-2">
        <div className="relative group mt-2">
          <button
            className={cn(
              "w-12 h-12 bg-white border-2 border-dashed border-[#D1D5DB] rounded-full flex items-center justify-center transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#F5F3FF] shadow-sm hover:shadow-md cursor-pointer",
            )}
            onClick={() => setIsOpenTeamAddModal(true)}
          >
            <Plus className="w-6 h-6 text-[#8B5CF6] transition-colors duration-200" />
          </button>
        </div>
      </div>

      {isTeamModalMounted && (
        <TeamAddModal isOpen={isOpenTeamAddModal} onOpenChange={(changed) => setIsOpenTeamAddModal(changed)} />
      )}
    </div>
  )
}