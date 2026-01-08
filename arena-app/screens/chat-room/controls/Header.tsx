import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
    <BlurView intensity={20} tint="light" style={[styles.container, { paddingTop: insets.top }]}>
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
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
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
