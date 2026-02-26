import type {
  ProfileDto,
  TeamDto,
  TeamMemberDto,
} from "@/api/generated/arenaAPI.schemas";
import { get as getOrgApi } from "@/api/generated/조직/조직";
import { get as getTeamApi } from "@/api/generated/팀/팀";
import { useOrgStore } from "@/stores/useOrgStore";
import { router, useLocalSearchParams } from "expo-router";
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

export default function TeamDetailScreen() {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const isOwner = currentOrg?.myRole === "OWNER";
  const [team, setTeam] = useState<TeamDto | null>(null);
  const [members, setMembers] = useState<TeamMemberDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!currentOrg?.orgId || !teamId) return;
    try {
      const teamApi = getTeamApi();
      const [teamResult, membersResult] = await Promise.all([
        teamApi.getTeam(currentOrg.orgId, teamId, { jwt }),
        teamApi.getMembers(currentOrg.orgId, teamId, { jwt }),
      ]);
      setTeam(teamResult.data ?? null);
      setMembers(membersResult.data ?? []);
    } catch {
      // TODO: 에러 처리
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentOrg?.orgId, teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMember = async () => {
    if (!currentOrg?.orgId || !teamId) return;
    // Org 멤버 목록에서 팀에 없는 멤버 표시
    try {
      const { getMembers1 } = getOrgApi();
      const orgMembers = await getMembers1(currentOrg.orgId, { jwt });
      const existingIds = new Set(members.map((m) => m.profileId));
      const available = (orgMembers.data ?? []).filter(
        (m) => !existingIds.has(m.profileId)
      );

      if (available.length === 0) {
        Alert.alert("알림", "추가할 수 있는 멤버가 없습니다.");
        return;
      }

      showMemberPicker(available);
    } catch {
      Alert.alert("오류", "멤버 목록을 불러오지 못했습니다.");
    }
  };

  const showMemberPicker = (available: ProfileDto[]) => {
    // Alert.alert로 간단한 선택 UI
    const buttons: { text: string; onPress?: () => void }[] = available
      .slice(0, 5)
      .map((m) => ({
        text: m.name ?? "?",
        onPress: () => { addMemberToTeam(m.profileId!); },
      }));
    buttons.push({ text: "취소" });

    Alert.alert("멤버 추가", "추가할 멤버를 선택하세요", buttons);
  };

  const addMemberToTeam = async (profileId: string) => {
    try {
      const { addMember } = getTeamApi();
      const result = await addMember(
        currentOrg!.orgId!,
        teamId!,
        { profileId },
        { jwt }
      );
      if (result.data) {
        setMembers((prev) => [...prev, result.data!]);
      }
    } catch {
      Alert.alert("오류", "멤버 추가에 실패했습니다.");
    }
  };

  const handleRemoveMember = (member: TeamMemberDto) => {
    Alert.alert("멤버 제거", `${member.name}님을 팀에서 제거하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "제거",
        style: "destructive",
        onPress: async () => {
          try {
            const { removeMember } = getTeamApi();
            await removeMember(
              currentOrg!.orgId!,
              teamId!,
              member.profileId!,
              { jwt }
            );
            setMembers((prev) =>
              prev.filter((m) => m.profileId !== member.profileId)
            );
          } catch {
            Alert.alert("오류", "멤버 제거에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleDeleteTeam = () => {
    Alert.alert("팀 삭제", `${team?.name} 팀을 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const { deleteTeam } = getTeamApi();
            await deleteTeam(currentOrg!.orgId!, teamId!, { jwt });
            router.back();
          } catch {
            Alert.alert("오류", "팀 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0a7ea4" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        keyExtractor={(item) => item.profileId!}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchData();
          }} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.teamName}>{team?.name}</Text>
            <Text style={styles.memberCount}>멤버 {members.length}명</Text>
          </View>
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
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>팀 멤버가 없습니다</Text>
          </View>
        }
      />

      {isOwner && (
        <View style={styles.bottomActions}>
          <Pressable style={styles.primaryBtn} onPress={handleAddMember}>
            <Text style={styles.primaryBtnText}>멤버 추가</Text>
          </Pressable>
          <Pressable style={styles.dangerBtn} onPress={handleDeleteTeam}>
            <Text style={styles.dangerBtnText}>팀 삭제</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E8EB",
  },
  teamName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
  },
  memberCount: {
    fontSize: 14,
    color: "#687076",
    marginTop: 4,
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
    gap: 8,
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
  dangerBtn: {
    backgroundColor: "#FFF1F0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  dangerBtnText: {
    color: "#E5484D",
    fontSize: 16,
    fontWeight: "600",
  },
});
