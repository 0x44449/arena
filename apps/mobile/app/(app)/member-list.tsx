import type { ProfileDto } from "@/api/generated/arenaAPI.schemas";
import { get as getOrgApi } from "@/api/generated/조직/조직";
import { useOrgStore } from "@/stores/useOrgStore";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

const jwt = {} as any;

export default function MemberListScreen() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const isOwner = currentOrg?.myRole === "OWNER";
  const [members, setMembers] = useState<ProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!currentOrg?.orgId) return;
    try {
      const { getMembers1 } = getOrgApi();
      const result = await getMembers1(currentOrg.orgId, { jwt });
      setMembers(result.data ?? []);
    } catch {
      // TODO: 에러 처리
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentOrg?.orgId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRemoveMember = (member: ProfileDto) => {
    Alert.alert(
      "멤버 추방",
      `${member.name}님을 추방하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "추방",
          style: "destructive",
          onPress: async () => {
            try {
              const { removeMember1 } = getOrgApi();
              await removeMember1(currentOrg!.orgId!, member.profileId!, { jwt });
              setMembers((prev) =>
                prev.filter((m) => m.profileId !== member.profileId)
              );
            } catch {
              Alert.alert("오류", "추방에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0a7ea4" />;
  }

  return (
    <FlatList
      style={styles.container}
      data={members}
      keyExtractor={(item) => item.profileId!}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          fetchMembers();
        }} />
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.memberRow}
          onLongPress={isOwner ? () => handleRemoveMember(item) : undefined}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name?.charAt(0) ?? "?"}</Text>
          </View>
          <Text style={styles.name}>{item.name}</Text>
          {item.role === "OWNER" && (
            <Text style={styles.ownerBadge}>관리자</Text>
          )}
        </Pressable>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>멤버가 없습니다</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    backgroundColor: "#fff",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E8EB",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0a7ea4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: "#11181C",
    marginLeft: 12,
  },
  ownerBadge: {
    fontSize: 12,
    color: "#0a7ea4",
    backgroundColor: "#E6F7FB",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: "hidden",
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#687076",
  },
});
