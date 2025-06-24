import { useTeamsQuery } from "@/api/team.hook";
import { matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import TeamCreateButtonWithModal from "./TeamCreateButtonWithModal";
import { useTeamStore } from "@/stores/team-store";
import { useEffect } from "react";

export default function TeamSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const match  = matchPath("/arena/:teamId", location.pathname);
  const teamId = match?.params.teamId;

  const teams = useTeamStore((state) => state.teams);
  const setTeams = useTeamStore((state) => state.setTeams);
  const { data: fetchedTeams } = useTeamsQuery();

  useEffect(() => {
    if (fetchedTeams) {
      setTeams(fetchedTeams);
    }
  }, [fetchedTeams]);

  const handleSelect = (selectedTeamId: string) => {
    navigate(`/arena/${selectedTeamId}`);
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* 상단 로고 */}
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer hover:brightness-90">
        A
      </div>

      {/* 팀 리스트 */}
      <div className="flex flex-col gap-3 mt-4 flex-1">
        {teams?.map((team) => (
          <div key={team.teamId} className="relative group">
            <button
              onClick={() => handleSelect(team.teamId)}
              className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${teamId === team.teamId ? "border-2 border-blue-500" : "bg-gray-200"}
                    hover:bg-gray-300
                    transition-all duration-200
                  `}
            >
              {team.name.charAt(0)}
            </button>
          </div>
        ))}
      </div>

      {/* 하단 추가 버튼 */}
      <TeamCreateButtonWithModal onCreated={() => console.log("팀 생성됨")} />
    </div>
  )
}