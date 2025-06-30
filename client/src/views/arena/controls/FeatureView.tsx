import useSelectedWorkspaceStore from "../stores/selected-workspace-store";
import ChatFeature from "./chat/ChatFeature";

interface FeatureViewProps {
  children?: React.ReactNode;
}

export default function FeatureView(props: FeatureViewProps) {
  const workspace = useSelectedWorkspaceStore((state) => state.selectedWorkspace);

  return (
    <div className="flex flex-col flex-1">
      {/* 상단: Workspace 이름 + 햄버거 메뉴 */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-300">
        <div className="text-lg font-bold text-gray-800 truncate">{workspace?.name ?? ''}</div>
        <button className="text-gray-500 hover:text-gray-700 text-xl">⋯</button>
      </div>

      <div className="flex-1 flex flex-col">
        {workspace && (
          <ChatFeature teamId={workspace.teamId} workspaceId={workspace.workspaceId} featureId={workspace.defaultFeatureId} />
        )}
      </div>
    </div>
  )
}