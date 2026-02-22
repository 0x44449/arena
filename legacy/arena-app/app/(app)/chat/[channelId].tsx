import ChatScreen from "@/screens/chat/ChatScreen";
import { useLocalSearchParams } from "expo-router";

export default function Chat() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();

  return <ChatScreen channelId={channelId!} />;
}
