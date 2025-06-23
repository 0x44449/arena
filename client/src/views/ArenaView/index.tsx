import { ProfileCard } from "@/controls/ProfileCard";
import TeamSidebar from "@/controls/TeamSidebar";

export default function ArenaView() {
  return (
    <div className="flex flex-row h-screen">

      <div className="flex flex-col w-100 bg-gray-100">
        <div className="flex flex-1 flex-row">
          {/* TeamSidebar */}
          <div className="flex flex-col w-20 overflow-y-auto border-r border-gray-300 items-center py-4">
            <TeamSidebar />
          </div>
          {/* WorkspaceView */}
        </div>

        <ProfileCard className="mx-2 mb-2" />
      </div>

      <div className="flex flex-1">
        {/* FeatureView */}
      </div>
    </div>
  )
}