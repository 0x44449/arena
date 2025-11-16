import type { ChatMessageDto } from "@/types/arena.type";
import { useState } from "react";
import { FlatList, Text } from "react-native";

export default function ChatMessageList() {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.messageId}
      renderItem={({ item }) => (
        <Text>{item.message}</Text>
      )}
    />
  )
}