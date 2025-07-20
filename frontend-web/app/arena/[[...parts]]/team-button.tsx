'use client';

import { TeamDto } from "@/api/generated";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TeamButtonProps {
  team: TeamDto;
  active?: boolean;
  hovered?: boolean;
}

export default function TeamButton(props: TeamButtonProps) {
  const { team, active, hovered } = props;

  return (
    <Link href={`/arena/${team.teamId}`} className="relative group">
      {/* Active/Hover Indicator */}
      {/* <div
        className={cn(
          "absolute left-0 w-1 bg-[#8B5CF6] rounded-r-full transition-all duration-200",
          active ? "h-10 -ml-[4px]" : hovered ? "h-5 -ml-[4px]" : "h-0 -ml-[4px]"
        )}
      /> */}

      <div
        // onClick={() => handleServerClick(server.id)}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 relative overflow-hidden shadow-sm",
          // active
          //   ? "rounded-2xl shadow-md"
          //   : "rounded-full hover:shadow-md",
          active ? "bg-[#8B5CF6] shadow-md" : "",
        )}
      >
        <span className={cn(
          "text-sm font-semibold",
          active ? "text-white" : "text-gray-700"
        )}>
          {team.name.charAt(0).toUpperCase() + team.name.charAt(1)}
        </span>
      </div>
    </Link>
  )
}