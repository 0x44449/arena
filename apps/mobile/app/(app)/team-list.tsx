import type { TeamDto } from "@/api/generated/arenaAPI.schemas";
import { get as getTeamApi } from "@/api/generated/팀/팀";
import { useOrgStore } from "@/stores/useOrgStore";
import { router } from "expo-router";
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

export default function TeamListScreen() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const isOwner = currentOrg?.myRole === "OWNER";
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeams = useCallback(async () => {
    if (!currentOrg?.orgId) return;
    try {
      const { getTeams } = getTeamApi();
      const result = await getTeams(currentOrg.orgId, { jwt });
      setTeams(result.data ?? []);
    } catch {
      // TODO: 에러 처리
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentOrg?.orgId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreateTeam = () => {
    Alert.prompt("팀 만들기", "팀 이름을 입력하세요", async (name) => {
      if (!name?.trim()) return;
      try {
        const { createTeam } = getTeamApi();
        const result = await createTeam(
          currentOrg!.orgId!,
          { name: name.trim() },
          { jwt }
        );
        if (result.data) {
          setTeams((prev) => [...prev, result.data!]);
        }
      } catch {
        Alert.alert("오류", "팀 생성에 실패했습니다.");
      }
    });
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0a7ea4" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.teamId!}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchTeams();
          }} />
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.teamRow}
            onPress={() =>
              router.push({
                pathname: "/(app)/team-detail",
                params: { teamId: item.teamId },
              })
            }
          >
            <View style={styles.teamIcon}>
              <Text style={styles.teamIconText}>T</Text>
            </View>
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{item.name}</Text>
              <Text style={styles.teamMemberCount}>
                멤버 {item.memberCount ?? 0}명
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>팀이 없습니다</Text>
          </View>
        }
      />

      {isOwner && (
        <View style={styles.bottomActions}>
          <Pressable style={styles.primaryBtn} onPress={handleCreateTeam}>
            <Text style={styles.primaryBtnText}>팀 만들기</Text>
          </Pressable>
        </View>
      )}
    </View>
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
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E8EB",
  },
  teamIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E6F7FB",
    justifyContent: "center",
    alignItems: "center",
  },
  teamIconText: {
    color: "#0a7ea4",
    fontSize: 16,
    fontWeight: "600",
  },
  teamInfo: {
    flex: 1,
    marginLeft: 12,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  teamMemberCount: {
    fontSize: 13,
    color: "#687076",
    marginTop: 2,
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#687076",
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  primaryBtn: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
