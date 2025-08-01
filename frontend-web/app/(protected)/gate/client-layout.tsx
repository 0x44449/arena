'use client';

import TeamSidebar from "@/controls/gate/team-sidebar/team-sidebar";
import TeamView from "@/controls/gate/team-view/team-view";
import UserProfileCard from "@/controls/gate/user-profile-card";
import { useParams } from "next/navigation";

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { teamId, channelId } = useParams<{
    teamId?: string;
    channelId?: string;
  }>();

  return (
    <div className="flex flex-col h-full w-full min-w-200 min-h-0 bg-[#F5F3FF]">
      <div className="flex flex-1 flex-row min-h-0 min-w-0">
        <div className="flex flex-col border-r border-[#E5E7EB]">
          <div className="flex flex-1 flex-row min-h-0 w-80">
            <div className="border-r border-[#E5E7EB]">
              <TeamSidebar teamId={teamId} />
            </div>
            <div className="flex flex-1 min-h-0 min-w-0">
              <TeamView teamId={teamId} channelId={channelId} />
            </div>
          </div>

          <UserProfileCard />
        </div>

        <div className="flex flex-1 min-h-0 min-w-0">{children}</div>
      </div>
    </div>
  )
}
