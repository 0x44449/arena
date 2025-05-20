import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatFeature from "../Feature/ChatFeature";
import { useWorkspaceQueryByWorkspaceId } from "@/api/workspace.hook";

interface WorkspaceMainProps {
  children?: React.ReactNode;
}

export default function WorkspaceMain(props: WorkspaceMainProps) {
  // const { teamId, workspaceId } = useParams<{ teamId: string; workspaceId: string }>();
  const { teamId, workspaceId } = useParams() as { teamId: string; workspaceId: string };
  const { data: workspace } = useWorkspaceQueryByWorkspaceId(workspaceId);

  return (
    <div className="flex flex-col flex-1">
      {/* 상단: Workspace 이름 + 햄버거 메뉴 */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-300">
        <div className="text-lg font-bold text-gray-800 truncate">{workspace?.name ?? ''}</div>
        <button className="text-gray-500 hover:text-gray-700 text-xl">⋯</button>
      </div>

      <div className="flex-1 flex">
        {workspace && (
          <ChatFeature teamId={teamId} workspaceId={workspaceId} featureId={workspace.defaultFeatureId} />
        )}
      </div>
    </div>
  )
}