import { StyleSheet, Text, View } from "react-native";
import type { ChannelDto } from "@/api/generated/models";
import ChannelAvatar from "./ChannelAvatar";

type Props = {
  channel: ChannelDto;
};

export default function ChannelItem({ channel }: Props) {
  const isGroup = channel.type !== "direct";
  const participants = channel.participants;

  // DM이면 상대방 이름, 그룹이면 채널 이름
  const title = isGroup ? channel.name : participants[0]?.user.nick;

  // 아바타 URL 목록
  const avatars = participants.map((p) => p.user.avatar?.url).filter(Boolean);

  return (
    <View style={styles.container}>
      <ChannelAvatar avatars={avatars} isGroup={isGroup} />
      <View style={styles.textArea}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {isGroup && (
            <Text style={styles.participantCount}>{participants.length}</Text>
          )}
        </View>
        {/* TODO: lastMessage 추가 필요 */}
        <Text style={styles.preview} numberOfLines={1}>
          메시지 없음
        </Text>
      </View>
      <View style={styles.metaArea}>
        <Text style={styles.time}>
          {channel.lastMessageAt ? formatTime(channel.lastMessageAt) : ""}
        </Text>
        {/* TODO: unreadCount 추가 필요 */}
      </View>
    </View>
  );
}

// 시간 포맷 (간단하게)
const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "어제";
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return "지난주";
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 12,
  },
  textArea: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2128",
    flexShrink: 1,
  },
  participantCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  preview: {
    fontSize: 13,
    color: "#6B7280",
  },
  metaArea: {
    alignItems: "flex-end",
    gap: 6,
  },
  time: {
    fontSize: 12,
    color: "#A0A4AF",
  },
});
