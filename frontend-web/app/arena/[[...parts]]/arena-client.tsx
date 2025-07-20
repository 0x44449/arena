'use client';

import { useArenaPath } from "./arena-path.hook";
import ProfileCard from "./profile-card";
import TeamView from "./team-view";
import WorkspaceView from "./workspace-view";

export default function ArenaClient() {
  const { teamId, workspaceId } = useArenaPath();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F5F3FF]">
      {/* <div className="flex flex-row w-full h-12 border-b border-[#E5E7EB]"></div> */}

      <div className="flex flex-row h-full w-full overflow-hidden">
        <div className="flex flex-col w-90">
          <div className="flex flex-1 flex-row border-r border-[#E5E7EB]">
            <div className="border-r border-[#E5E7EB]">
              {/* TeamView */}
              <TeamView />
            </div>

            {/* WorkspaceView */}
            <div className="flex flex-col flex-1">
              {/* <WorkspaceView /> */}
              <WorkspaceView />
            </div>
          </div>

          {/* ProfileCard */}
          <ProfileCard />
        </div>

        <div className="flex flex-1 bg-white">
          {/* View */}
        </div>
      </div>
    </div>
  )
}