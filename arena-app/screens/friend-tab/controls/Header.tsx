import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerSpacer} />
      <View style={styles.headerActions}>
        <View style={styles.headerIconButton}>
          <Feather name="search" size={20} color="#3C3F4B" />
        </View>
        <View style={styles.headerIconButton}>
          <Feather name="user-plus" size={20} color="#3C3F4B" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#EEF0F4",
    alignItems: "center",
    justifyContent: "center",
  },
});
