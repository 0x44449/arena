import { ChatMessageDto } from "@/types/chat-message.dto";
import ChatArea from "./Chat/ChatArea";
import ChatInputArea from "./Chat/ChatInputArea";
import { useState } from "react";

interface ChatFeatureProps {
  teamId: string;
  workspaceId: string;
  featureId: string;
}

export default function ChatFeature(props: ChatFeatureProps) {
  const { teamId, workspaceId, featureId } = props;
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);

  const handleSend = (input: string) => {
    console.log("Sending message:", input);
  };

  return (
    <div>
      <ChatArea messages={messages} />
      <ChatInputArea onSend={handleSend} />
    </div>
  )
}