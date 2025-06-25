import { useChatFeature, useChatFeatureConnectionSync } from "../../hooks/chat.hook";
import ChatArea from "./ChatArea";
import ChatInputArea from "./ChatInputArea";

interface ChatFeatureProps {
  teamId: string;
  workspaceId: string;
  featureId: string;
}

export default function ChatFeature(props: ChatFeatureProps) {
  const { teamId, workspaceId, featureId } = props;
  useChatFeatureConnectionSync({ featureId });
  const { messages, sendMessage } = useChatFeature({ featureId });

  const handleSend = (input: string) => {
    console.log("Sending message:", input);
    sendMessage(input);
  };

  return (
    <div className="flex flex-col flex-1">
      <ChatArea messages={messages} />
      <ChatInputArea onSend={handleSend} />
    </div>
  )
}