'use client';

import ChatMain from "@/controls/gate/chat/chat-main";
import ChannelFrame from "@/controls/gate/channel-frame/channel-frame";
import { useParams } from "next/navigation";

export default function Page() {
  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();

  return (
    <ChannelFrame teamId={teamId} channelId={channelId}>
      <ChatMain teamId={teamId} channelId={channelId} />
    </ChannelFrame>
  )
}