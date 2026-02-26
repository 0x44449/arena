import type { OrgDto } from "@/api/generated/arenaAPI.schemas";
import { get as getOrgApi } from "@/api/generated/조직/조직";
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
import { SafeAreaView } from "react-native-safe-area-context";

const jwt = {} as any;

export default function OrgListScreen() {
  const [orgs, setOrgs] = useState<OrgDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const setCurrentOrg = useOrgStore((s) => s.setCurrentOrg);

  const fetchOrgs = useCallback(async () => {
    try {
      const { getMyOrgs } = getOrgApi();
      const result = await getMyOrgs({ jwt });
      setOrgs(result.data ?? []);
    } catch {
      // TODO: 에러 처리
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const handleSelectOrg = (org: OrgDto) => {
    setCurrentOrg(org);
    router.push("/(app)/(tabs)" as any);
  };

  const handleCreateOrg = () => {
    Alert.prompt("조직 만들기", "조직 이름을 입력하세요", async (name) => {
      if (!name?.trim()) return;
      try {
        const { createOrg } = getOrgApi();
        const result = await createOrg({ name: name.trim() }, { jwt });
        if (result.data) {
          setOrgs((prev) => [...prev, result.data!]);
        }
      } catch {
        Alert.alert("오류", "조직 생성에 실패했습니다.");
      }
    });
  };

  const handleJoinOrg = () => {
    Alert.prompt("초대 코드로 가입", "초대 코드를 입력하세요", async (code) => {
      if (!code?.trim()) return;
      try {
        const { joinOrg } = getOrgApi();
        const result = await joinOrg({ code: code.trim() }, { jwt });
        if (result.data) {
          setOrgs((prev) => [...prev, result.data!]);
        }
      } catch {
        Alert.alert("오류", "가입에 실패했습니다. 코드를 확인해주세요.");
      }
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrgs();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" color="#0a7ea4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>내 조직</Text>

      <FlatList
        data={orgs}
        keyExtractor={(item) => item.orgId!}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={orgs.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>아직 속한 조직이 없습니다</Text>
            <Text style={styles.emptySubText}>
              조직을 만들거나 초대 코드로 가입하세요
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.orgCard} onPress={() => handleSelectOrg(item)}>
            <View style={styles.orgAvatar}>
              <Text style={styles.orgAvatarText}>
                {item.name?.charAt(0) ?? "?"}
              </Text>
            </View>
            <View style={styles.orgInfo}>
              <Text style={styles.orgName}>{item.name}</Text>
              {item.description ? (
                <Text style={styles.orgDesc} numberOfLines={1}>
                  {item.description}
                </Text>
              ) : null}
            </View>
            <Text style={styles.roleTag}>
              {item.myRole === "OWNER" ? "관리자" : "멤버"}
            </Text>
          </Pressable>
        )}
      />

      <View style={styles.bottomActions}>
        <Pressable style={styles.primaryBtn} onPress={handleCreateOrg}>
          <Text style={styles.primaryBtnText}>조직 만들기</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={handleJoinOrg}>
          <Text style={styles.secondaryBtnText}>초대 코드로 가입</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    color: "#11181C",
  },
  emptyContainer: {
    flex: 1,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#687076",
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  orgCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E8EB",
  },
  orgAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#0a7ea4",
    justifyContent: "center",
    alignItems: "center",
  },
  orgAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  orgInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orgName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  orgDesc: {
    fontSize: 13,
    color: "#687076",
    marginTop: 2,
  },
  roleTag: {
    fontSize: 12,
    color: "#687076",
    backgroundColor: "#F1F3F5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: "hidden",
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingBottom: 12,
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
  secondaryBtn: {
    backgroundColor: "#F1F3F5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#11181C",
    fontSize: 16,
    fontWeight: "500",
  },
});
