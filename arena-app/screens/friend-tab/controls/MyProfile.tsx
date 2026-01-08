import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

type MyProfileProps = {
  avatar: string;
  nickname: string;
  tag: string;
  statusMessage?: string;
};

export default function MyProfile({ avatar, nickname, tag, statusMessage }: MyProfileProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
      <View style={styles.details}>
        <Text style={styles.name}>
          {nickname} <Text style={styles.tag}>{tag}</Text>
        </Text>
        {statusMessage ? (
          <Text style={styles.statusMessage} numberOfLines={1}>
            {statusMessage}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#F5F6F8",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E0E2E9",
  },
  details: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F222C",
  },
  tag: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  statusMessage: {
    fontSize: 13,
    color: "#6B7280",
  },
});
