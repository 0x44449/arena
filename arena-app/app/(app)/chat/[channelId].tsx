import ChatRoomScreen from "@/screens/chat-room/ChatRoomScreen";
import { useLocalSearchParams } from "expo-router";

export default function ChatRoom() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();

  return <ChatRoomScreen channelId={channelId!} />;
}
