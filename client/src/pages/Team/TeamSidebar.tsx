import { useState } from 'react';
import TeamCreateButtonWithModal from './TeamCreateButtonWithModal';
import { useTeamsQuery } from '@/api/team.hook';
import { useNavigate, useParams } from 'react-router-dom';

export default function TeamSidebar() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { data: teams } = useTeamsQuery();

  const handleSelect = (teamId: string) => {
    navigate(`/arena/${teamId}`);
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 w-20 py-4 space-y-4 border-r border-gray-300">
      {/* 상단 로고 */}
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer hover:brightness-90">
        A
      </div>

      {/* 팀 리스트 */}
      <div className="flex flex-col items-center gap-3 mt-4 flex-1">
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

            {/* 툴팁 */}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap">
              {team.name}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 추가 버튼 */}
      <TeamCreateButtonWithModal onCreated={() => console.log("팀 생성됨")} />
    </div>
  )
}