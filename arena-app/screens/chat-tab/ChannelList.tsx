import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { channelsTable } from "@/db";
import type { ChannelDto } from "@/api/generated/models";
import ChannelItem from "./controls/ChannelItem";

export default function ChannelList() {
  const [channels, setChannels] = useState<ChannelDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    channelsTable.findAll().then((data) => {
      setChannels(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={channels}
      keyExtractor={(channel) => channel.channelId}
      renderItem={({ item }) => <ChannelItem channel={item} />}
      ListEmptyComponent={() => (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>아직 대화가 없습니다</Text>
          <Text style={styles.emptySubtitle}>친구를 선택해 대화를 시작해보세요</Text>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#434756",
    fontWeight: "600",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B707C",
  },
});
