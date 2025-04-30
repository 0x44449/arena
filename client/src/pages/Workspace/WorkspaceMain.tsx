import { useState } from "react";

interface WorkspaceMainProps {
  children?: React.ReactNode;
}

export default function WorkspaceMain(props: WorkspaceMainProps) {
  const { children } = props;

  return (
    <div className="flex flex-col w-screen h-screen">
      {/* 상단: Workspace 이름 + 햄버거 메뉴 */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-300">
        <div className="text-lg font-bold text-gray-800 truncate">General</div>
        <button className="text-gray-500 hover:text-gray-700 text-xl">⋯</button>
      </div>

      {children}
    </div>
  )
}