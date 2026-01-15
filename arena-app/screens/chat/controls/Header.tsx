import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HeaderProps = {
  title: string;
  memberCount?: number;
};

export default function Header({ title, memberCount }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#3C3F4B" />
        </Pressable>
        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {memberCount ? (
            <Text style={styles.memberCount}>{memberCount}</Text>
          ) : null}
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.iconButton}>
            <Feather name="search" size={20} color="#3C3F4B" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Feather name="menu" size={20} color="#3C3F4B" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  titleArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E2128",
    flexShrink: 1,
  },
  memberCount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
