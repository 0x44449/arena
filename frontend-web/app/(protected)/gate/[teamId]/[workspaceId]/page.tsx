'use client';

import ChatMain from "@/controls/gate/chat/chat-main";
import WorkspaceFrame from "@/controls/gate/workspace-frame/workspace-frame";
import { useParams } from "next/navigation";

export default function Page() {
  const { teamId, workspaceId } = useParams<{
    teamId: string;
    workspaceId: string;
  }>();

  return (
    <div className="flex flex-1 bg-white">
      <WorkspaceFrame teamId={teamId} workspaceId={workspaceId}>
        <ChatMain teamId={teamId} workspaceId={workspaceId} />
      </WorkspaceFrame>
    </div>
  )
}