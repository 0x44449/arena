import { ProfileCard } from "@/views/ArenaView/ProfileCard";
import TeamSidebar from "@/pages/Team/TeamSidebar";
import { Outlet } from "react-router-dom";

export default function ArenaLayout() {
  return (
    <div className="flex h-screen w-screen">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-row">
          {/* TeamList */}
          <aside className="w-20 bg-gray-100 border-r border-gray-300 overflow-y-auto overflow-x-hidden">
            <TeamSidebar />
          </aside>

          <div className="flex flex-1">
            {/* WorkspaceView */}
            <Outlet />
          </div>
        </div>

        {/* My ProfileCard */}
        <ProfileCard />
      </div>
    </div>
  )
}
