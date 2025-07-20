'use client';

import { useArenaPath } from "./arena-path.hook";
import ProfileCard from "./profile-card";
import TeamSidebar from "./team-sidebar";

export default function ArenaClient() {
  const { teamId, workspaceId } = useArenaPath();

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <div className="flex flex-col bg-[#F5F3FF] w-100">
        <div className="flex flex-1 flex-row">
          {/* TeamSidebar */}
          <TeamSidebar />
          
          {/* WorkspaceView */}
          <div className="flex flex-col flex-1 bg-[#FAFAFA]">
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