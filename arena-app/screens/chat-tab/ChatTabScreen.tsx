import { useGetMyChannels } from "@/api/generated/endpoints/channels/channels";
import type { ChannelDto } from "@/api/generated/models";
import { CS } from "@/libs/common-style";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChannelItem from "./controls/ChannelItem";
import EmptyState from "./controls/EmptyState";
import Header from "./controls/Header";

const HEADER_HEIGHT = 58;

const getChannelTitle = (channel: ChannelDto): string => {
  if (channel.name) return channel.name;
  // DM인 경우 상대방 닉네임
  const other = channel.participants[0];
  return other?.user.nick ?? "알 수 없음";
};

const getParticipants = (channel: ChannelDto) => {
  return channel.participants.map((p) => ({
    id: p.user.userId,
    avatar: p.user.avatar?.url ?? `https://api.dicebear.com/9.x/adventurer/png?seed=${p.user.userId}`,
  }));
};

const formatTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "어제";
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  }
};

export default function ChatTabScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, error } = useGetMyChannels();

  const channels = data?.data ?? [];

  if (isLoading) {
    return (
      <View style={[CS.flex1, CS.bgWhite, CS.center]}>
        <ActivityIndicator size="large" color="#3C6DF0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[CS.flex1, CS.bgWhite, CS.center]}>
        <Text style={styles.errorText}>채널 목록을 불러올 수 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={[CS.flex1, CS.bgWhite]}>
      <FlatList
        data={channels}
        keyExtractor={(channel) => channel.channelId}
        renderItem={({ item }) => (
          <ChannelItem
            id={item.channelId}
            title={getChannelTitle(item)}
            participants={getParticipants(item)}
            lastMessage=""
            lastMessageTime={formatTime(item.lastMessageAt)}
            unreadCount={0}
            isGroup={item.type !== "direct"}
          />
        )}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + HEADER_HEIGHT },
        ]}
        showsVerticalScrollIndicator={false}
      />
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  errorText: {
    fontSize: 15,
    color: "#6B7280",
  },
});
