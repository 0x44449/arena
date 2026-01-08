import { StyleSheet, Text, View } from "react-native";

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>아직 친구가 없습니다</Text>
      <Text style={styles.text}>친구를 추가하면 여기에 표시됩니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 15,
    color: "#6B707C",
  },
});
