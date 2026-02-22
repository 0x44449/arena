import { useCreateMessage } from "@/api/generated/endpoints/messages/messages";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MessageInputProps = {
  channelId: string;
  onMessageSent?: () => void;
};

export default function MessageInput({ channelId, onMessageSent }: MessageInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const { mutate: sendMessage } = useCreateMessage();

  const handleSend = () => {
    const content = text.trim();
    if (!content) return;

    setText("");
    sendMessage({ channelId, data: { content } }, {
      onSuccess: () => onMessageSent?.(),
    });
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 12 }]}>
      <View style={styles.inputRow}>
        <Pressable style={styles.iconButton}>
          <Feather name="plus" size={22} color="#6B7280" />
        </Pressable>
        <TextInput
          style={styles.textInput}
          placeholder="메시지 입력..."
          placeholderTextColor="#9CA3AF"
          multiline
          value={text}
          onChangeText={setText}
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Feather name="send" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E2128",
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3C6DF0",
    alignItems: "center",
    justifyContent: "center",
  },
});
