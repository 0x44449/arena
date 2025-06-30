import { useWorkspacesQueryByTeamId } from "@/api/workspace.hook";
import { useTeamStore } from "@/stores/team-store";
import { matchPath, useLocation, useNavigate, useParams } from "react-router-dom";
import WorkspaceCreateButtonWithModal from "./WorkspaceCreateButtonWithModal";
import { useEffect } from "react";
import useSelectedWorkspaceStore from "../stores/selected-workspace-store";

export default function WorkspaceView() {
  const navigate = useNavigate();
  
  const { "*": splat } = useParams();
  const teamId = splat?.split('/')[0];
  const workspaceId = splat?.split('/')[1];

  const team = useTeamStore((state) => state.teams.find((t) => t.teamId === teamId));
  const { data: workspaces } = useWorkspacesQueryByTeamId({
    teamId,
    options: {
      enabled: !!teamId,
      gcTime: 0,
      staleTime: 0,
    }
  });

  const selectedWorkspace = useSelectedWorkspaceStore((state) => state.selectedWorkspace);
  const selectWorkspace = useSelectedWorkspaceStore((state) => state.selectWorkspace);
  const unselectWorkspace = useSelectedWorkspaceStore((state) => state.unselectWorkspace);

  useEffect(() => {
    if (workspaceId && workspaces) {
      const workspace = workspaces.find((ws) => ws.workspaceId === workspaceId);
      if (workspace) {
        if (selectedWorkspace?.workspaceId !== workspace.workspaceId) {
          selectWorkspace(workspace);
        }
      } else {
        unselectWorkspace();
      }
    }
  }, [workspaceId, workspaces]);

  const handleSelectWorkspace = (selectWorkspaceId: string) => {
    if (workspaceId === selectWorkspaceId) return;
    navigate(`/arena/${teamId}/${selectWorkspaceId}`);
  };

  return (
    <div className="flex flex-col py-4 px-2 space-y-2">
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
        <WorkspaceCreateButtonWithModal teamId={teamId || ''} />
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
            onClick={() => handleSelectWorkspace(workspace.workspaceId)}
            className={`
                w-full text-left px-4 py-2 rounded-md
                ${selectedWorkspace?.workspaceId === workspace.workspaceId ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}
                transition-all duration-150
              `}
          >
            {workspace.name}
          </button>
        ))}
      </div>
    </div>
  )
}