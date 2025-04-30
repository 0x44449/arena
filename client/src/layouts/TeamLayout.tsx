import WorkspaceSidebar from "@/pages/Workspace/WorkspaceSidebar";
import { Outlet } from "react-router-dom";

export default function TeamLayout() {
  return (
    <div className="flex flex-1 flex-row">
      {/* 워크스페이스 사이드바 */}
      <aside className="w-60 bg-gray-50 border-r border-gray-300 overflow-y-auto flex items-center justify-center text-gray-500 text-sm">
        <WorkspaceSidebar />
      </aside>

      <div className="flex flex-1">
          <Outlet />
        </div>
    </div>
  )
}