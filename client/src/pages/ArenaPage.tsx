import FeatureView from "@/features/arena/controls/FeatureView";
import ProfileCard from "@/features/arena/controls/ProfileCard";
import TeamSidebar from "@/features/arena/controls/TeamSidebar";
import WorkspaceView from "@/features/arena/controls/WorkspaceView";

export default function ArenaPage() {
  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="flex flex-col w-100 bg-gray-100">
        <div className="flex flex-1 flex-row">
          {/* TeamSidebar */}
          <div className="flex flex-col w-20 overflow-y-auto border-r border-gray-300 items-center py-4">
            <TeamSidebar />
          </div>
          {/* WorkspaceView */}
          <div className="flex flex-col flex-1">
            <WorkspaceView />
          </div>
        </div>

        {/* My ProfileCard */}
        <ProfileCard className="mx-2 mb-2" />
      </div>

      <div className="flex flex-1">
        {/* FeatureView */}
        <FeatureView />
      </div>
    </div>
  )
}