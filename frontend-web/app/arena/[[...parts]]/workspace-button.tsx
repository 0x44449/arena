'use client';

import { WorkspaceDto } from "@/api/generated";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";

interface WorkspaceButtonProps {
  workspace: WorkspaceDto;
  active?: boolean;
  onClick?: (workspace: WorkspaceDto) => void;
}

export default function WorkspaceButton(props: WorkspaceButtonProps) {
  const { workspace, active, onClick } = props;

  return (
    <button
      onClick={() => onClick?.(workspace)}
      className={cn(
        "w-full flex items-center space-x-2 px-2 py-1 rounded text-sm transition-colors duration-150 group",
        active
          ? "bg-[#8B5CF6] text-white"
          : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]"
      )}
    >
      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
        <Hash className="w-3.5 h-3.5" />
      </div>
      <span className="truncate flex-1 text-left">{workspace.name}</span>
      {/* {channel.type === 'voice' && (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button className="w-4 h-4 flex items-center justify-center rounded hover:bg-black/10">
            <Users className="w-3 h-3" />
          </button>
        </div>
      )} */}
    </button>
  )
}