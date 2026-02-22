import { StyleSheet, Text, View } from "react-native";

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>아직 대화가 없습니다</Text>
      <Text style={styles.subtitle}>친구를 선택해 대화를 시작해보세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 16,
    color: "#434756",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B707C",
  },
});
