'use client';

import { useParams } from "next/navigation";
import { useArenaPath } from "./arena-path.hook";
import ProfileCard from "./profile-card";

export default function ArenaClient() {
  const { teamId, workspaceId } = useArenaPath();

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <div className="flex flex-col w-100 bg-gray-100">
        <div className="flex flex-1 flex-row">
          {/* TeamSidebar */}
          <div className="flex flex-col w-20 overflow-y-auto border-r border-gray-300 items-center py-4">
            {/* <TeamSidebar /> */}
          </div>
          {/* WorkspaceView */}
          <div className="flex flex-col flex-1">
            {/* <WorkspaceView /> */}
          </div>
        </div>

        {/* ProfileCard */}
        <ProfileCard />
      </div>

      <div className="flex flex-1">
        {/* View */}
      </div>
    </div>
  )
}