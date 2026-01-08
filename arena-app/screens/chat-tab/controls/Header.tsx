import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <BlurView intensity={20} tint="light" style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <View style={styles.headerActions}>
          <View style={styles.headerIconButton}>
            <Feather name="search" size={20} color="#3C3F4B" />
          </View>
          <View style={styles.headerIconButton}>
            <Feather name="edit-3" size={20} color="#3C3F4B" />
          </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 32,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(238, 240, 244, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
});
