import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

type MessageItemProps = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  isMine: boolean;
  showAvatar: boolean;
  showName: boolean;
  isNewSender: boolean; // 발신자가 바뀌면 true
};

export default function MessageItem({
  content,
  senderName,
  senderAvatar,
  timestamp,
  isMine,
  showAvatar,
  showName,
  isNewSender,
}: MessageItemProps) {
  if (isMine) {
    return (
      <View style={[styles.myMessageRow, isNewSender && styles.newSenderGap]}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        <View style={styles.myBubble}>
          <Text style={styles.myMessageText}>{content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.otherMessageRow, isNewSender && styles.newSenderGap]}>
      {showAvatar ? (
        <Image source={{ uri: senderAvatar }} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={styles.avatarSpacer} />
      )}
      <View style={styles.otherMessageContent}>
        {showName ? <Text style={styles.senderName}>{senderName}</Text> : null}
        <View style={styles.otherBubbleRow}>
          <View style={styles.otherBubble}>
            <Text style={styles.otherMessageText}>{content}</Text>
          </View>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  newSenderGap: {
    marginTop: 12,
  },
  myMessageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 6,
  },
  myBubble: {
    backgroundColor: "#3C6DF0",
    borderRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "75%",
  },
  myMessageText: {
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  otherMessageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E0E2E9",
  },
  avatarSpacer: {
    width: 36,
  },
  otherMessageContent: {
    flex: 1,
    gap: 4,
  },
  senderName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 4,
  },
  otherBubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  otherBubble: {
    backgroundColor: "#F1F2F4",
    borderRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "75%",
  },
  otherMessageText: {
    fontSize: 15,
    color: "#1E2128",
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: "#A0A4AF",
  },
});
