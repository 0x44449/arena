import { useState } from 'react';
import { useParams } from 'react-router-dom';
import WorkspaceCreateButtonWithModal from './WorkspaceCreateButtonWithModal';
import { useTeamQueryByTeamId } from '@/api/team.hook';
import { useWorkspacesQueryByTeamId } from '@/api/workspace.hook';

export default function WorkspaceSidebar() {
  const { teamId, workspaceId } = useParams<{ teamId: string; workspaceId: string }>();
  const { data: team } = useTeamQueryByTeamId(teamId);
  const { data: workspaces } = useWorkspacesQueryByTeamId(teamId);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  const handleSelect = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
  };

  const handleAddWorkspace = () => {
  }

  return (
    <div className="flex flex-col bg-gray-50 w-60 h-full py-4 px-2 space-y-2 overflow-y-auto">
      {/* 현재 Team 이름 */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="text-2xl font-bold text-gray-800 truncate">
          {team?.name || ''}
        </div>
        {/* <button
          onClick={() => console.log('Open team settings menu')}
          className="text-gray-500 hover:text-gray-700 text-xl leading-none"
        >
          ⋯
        </button> */}
      </div>

      {/* 상단 제목 + +버튼 */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="text-sm font-semibold text-gray-700">Workspaces</div>
        <WorkspaceCreateButtonWithModal teamId={teamId || ''} onCreated={handleAddWorkspace} />
      </div>

      {/* 구분선 */}
      <div className="px-2">
        <div className="border-b border-gray-300"></div>
      </div>

      {/* 워크스페이스 리스트 */}
      <div className="mt-2 flex flex-col gap-2">
        {workspaces?.map((workspace) => (
          <button
            key={workspace.workspaceId}
            onClick={() => handleSelect(workspace.workspaceId)}
            className={`
            w-full text-left px-4 py-2 rounded-md
            ${selectedWorkspace === workspace.workspaceId ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}
            transition-all duration-150
          `}
          >
            {workspace.name}
          </button>
        ))}
      </div>
    </div>
  );
}