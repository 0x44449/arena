import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

type Participant = {
  id: string;
  avatar: string;
};

type ChannelItemProps = {
  title: string;
  participants: Participant[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
};

const AVATAR_SIZE = 56;

const ChannelAvatar = ({
  participants,
  isGroup,
}: Pick<ChannelItemProps, "participants" | "isGroup">) => {
  if (!isGroup) {
    return (
      <Image
        source={{ uri: participants[0]?.avatar }}
        style={styles.avatarSingle}
        contentFit="cover"
      />
    );
  }

  const sliced = participants.slice(0, 4);

  // 2명: 대각선 겹침 배치
  if (sliced.length === 2) {
    return (
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: sliced[0].avatar }}
          style={[styles.avatar2Item, styles.avatar2Back]}
          contentFit="cover"
        />
        <Image
          source={{ uri: sliced[1].avatar }}
          style={[styles.avatar2Item, styles.avatar2Front]}
          contentFit="cover"
        />
      </View>
    );
  }

  // 3명: 위 1개 중앙, 아래 2개
  if (sliced.length === 3) {
    return (
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: sliced[0].avatar }}
          style={[styles.avatar3Item, styles.avatar3Top]}
          contentFit="cover"
        />
        <Image
          source={{ uri: sliced[1].avatar }}
          style={[styles.avatar3Item, styles.avatar3BottomLeft]}
          contentFit="cover"
        />
        <Image
          source={{ uri: sliced[2].avatar }}
          style={[styles.avatar3Item, styles.avatar3BottomRight]}
          contentFit="cover"
        />
      </View>
    );
  }

  // 4명: 2x2 그리드, 원형
  return (
    <View style={styles.avatarContainer}>
      <Image
        source={{ uri: sliced[0].avatar }}
        style={[styles.avatar4Item, styles.avatar4TopLeft]}
        contentFit="cover"
      />
      <Image
        source={{ uri: sliced[1].avatar }}
        style={[styles.avatar4Item, styles.avatar4TopRight]}
        contentFit="cover"
      />
      <Image
        source={{ uri: sliced[2].avatar }}
        style={[styles.avatar4Item, styles.avatar4BottomLeft]}
        contentFit="cover"
      />
      <Image
        source={{ uri: sliced[3].avatar }}
        style={[styles.avatar4Item, styles.avatar4BottomRight]}
        contentFit="cover"
      />
    </View>
  );
};

export default function ChannelItem({
  title,
  participants,
  lastMessage,
  lastMessageTime,
  unreadCount,
  isGroup,
}: ChannelItemProps) {
  return (
    <View style={styles.container}>
      <ChannelAvatar participants={participants} isGroup={isGroup} />
      <View style={styles.textArea}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {isGroup ? (
            <Text style={styles.titleCount}>{participants.length}</Text>
          ) : null}
        </View>
        <Text style={styles.preview} numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>
      <View style={styles.metaArea}>
        <Text style={styles.time}>{lastMessageTime}</Text>
        {unreadCount > 0 ? (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 12,
  },
  avatarSingle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#E0E2E9",
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    position: "relative",
  },
  // 2명 스타일
  avatar2Item: {
    width: 33,
    height: 33,
    borderRadius: 18,
    backgroundColor: "#E0E2E9",
    position: "absolute",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatar2Back: {
    top: 2,
    left: 2,
  },
  avatar2Front: {
    bottom: 2,
    right: 2,
  },
  // 3명 스타일
  avatar3Item: {
    width: 29.5,
    height: 29.5,
    borderRadius: 17,
    backgroundColor: "#E0E2E9",
    position: "absolute",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatar3Top: {
    top: 1,
    left: 11,
  },
  avatar3BottomLeft: {
    bottom: 1,
    left: 1,
  },
  avatar3BottomRight: {
    bottom: 1,
    right: 1,
  },
  // 4명 스타일 (2x2 그리드, 원형, 겹침)
  avatar4Item: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#E0E2E9",
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  avatar4TopLeft: {
    top: 1,
    left: 1,
  },
  avatar4TopRight: {
    top: 1,
    right: 1,
  },
  avatar4BottomLeft: {
    bottom: 1,
    left: 1,
  },
  avatar4BottomRight: {
    bottom: 1,
    right: 1,
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
  titleCount: {
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
  unreadBadge: {
    backgroundColor: "#3C6DF0",
    borderRadius: 999,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    fontSize: 13,
    color: "white",
    fontWeight: "700",
  },
});
