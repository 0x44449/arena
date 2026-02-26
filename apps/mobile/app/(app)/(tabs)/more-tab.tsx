import { supabase } from "@/libs/supabase";
import { useOrgStore } from "@/stores/useOrgStore";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { get as getOrgApi } from "@/api/generated/조직/조직";

const jwt = {} as any;

interface MenuItem {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  ownerOnly?: boolean;
}

export default function MoreTab() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const clearCurrentOrg = useOrgStore((s) => s.clearCurrentOrg);
  const isOwner = currentOrg?.myRole === "OWNER";

  const handleLogout = () => {
    Alert.alert("로그아웃", "로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          clearCurrentOrg();
          await supabase.auth.signOut();
        },
      },
    ]);
  };

  const handleLeaveOrg = () => {
    Alert.alert("조직 탈퇴", `${currentOrg?.name}에서 탈퇴하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "탈퇴",
        style: "destructive",
        onPress: async () => {
          try {
            const { leaveOrg } = getOrgApi();
            await leaveOrg(currentOrg!.orgId!, { jwt });
            clearCurrentOrg();
            router.replace("/(app)/org-list");
          } catch {
            Alert.alert("오류", "탈퇴에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleSwitchOrg = () => {
    clearCurrentOrg();
    router.replace("/(app)/org-list");
  };

  const menuItems: MenuItem[] = [
    {
      label: "멤버",
      onPress: () => router.push("/(app)/member-list"),
    },
    {
      label: "팀",
      onPress: () => router.push("/(app)/team-list"),
    },
    {
      label: "조직 설정",
      onPress: () => router.push("/(app)/org-settings"),
      ownerOnly: true,
    },
    {
      label: "조직 변경",
      onPress: handleSwitchOrg,
    },
    {
      label: "조직 탈퇴",
      onPress: handleLeaveOrg,
      destructive: true,
    },
    {
      label: "로그아웃",
      onPress: handleLogout,
      destructive: true,
    },
  ];

  const visibleItems = menuItems.filter((item) => !item.ownerOnly || isOwner);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{currentOrg?.name ?? "더보기"}</Text>

      <ScrollView style={styles.menu}>
        {visibleItems.map((item) => (
          <Pressable key={item.label} style={styles.menuItem} onPress={item.onPress}>
            <Text
              style={[styles.menuLabel, item.destructive && styles.destructiveLabel]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    color: "#11181C",
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E8EB",
  },
  menuLabel: {
    fontSize: 16,
    color: "#11181C",
  },
  destructiveLabel: {
    color: "#E5484D",
  },
});
