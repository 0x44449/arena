import { CS } from "@/libs/common-style";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreTab() {
  return (
    <SafeAreaView style={[CS.flex1, CS.bgWhite]} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.body}>
        <View style={styles.listContainer}>
          <TouchableOpacity activeOpacity={0.8} style={styles.listRow}>
            <View>
              <Text style={styles.listLabel}>로그아웃</Text>
              <Text style={styles.listDescription} numberOfLines={1}>
                다시 로그인하려면 계정 정보가 필요해요
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.listRow}>
            <Text style={styles.versionText}>앱 버전 1.0.0</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerSpacer: {
    height: 12,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  listContainer: {
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  listLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#16181F",
  },
  listDescription: {
    fontSize: 12,
    color: "#7A7F8C",
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E4E6EB",
  },
  versionText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
