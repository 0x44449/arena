import { TeamDto } from "@/api/generated";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TeamButtonProps {
  team: TeamDto;
  active?: boolean;
}

export default function TeamButton(props: TeamButtonProps) {
  const { team, active } = props;

  return (
    <Link href={`/gate/${team.teamId}`} className="relative group">
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 relative overflow-hidden shadow-sm",
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