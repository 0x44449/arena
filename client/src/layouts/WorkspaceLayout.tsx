import WorkspaceMain from "@/pages/Workspace/WorkspaceMain";

export default function WorkspaceLayout() {
  return (
    <div className="flex flex-1 flex-row">
      {/* 메인 콘텐츠 */}
      <main className="flex-1 bg-white overflow-y-auto flex items-start justify-center text-gray-600 text-lg">
        <WorkspaceMain />
      </main>
    </div>
  )
}