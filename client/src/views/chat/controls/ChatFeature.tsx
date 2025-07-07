import { useEffect } from "react";
import { useChatFeatureConnectionSync } from "../hooks/chat.hook";
import { useChatStore } from "../stores/chat-store";
import ChatArea from "./ChatArea";
import ChatInputArea from "./ChatInputArea";
import ChatImageViewer from "./ChatImageViewer";

interface ChatFeatureProps {
  teamId: string;
  workspaceId: string;
  featureId: string;
}

export default function ChatFeature(props: ChatFeatureProps) {
  const { teamId, workspaceId, featureId } = props;
  useChatFeatureConnectionSync({ featureId });
  const { joinChat, exitChat } = useChatStore();

  useEffect(() => {
    joinChat(featureId);
    return () => exitChat();
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col flex-1 min-h-0">
        <ChatArea />
      </div>
      <ChatInputArea />
      <ChatImageViewer />
    </div>
  )
}