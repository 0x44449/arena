import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

type FriendItemProps = {
  avatar: string;
  nickname: string;
  tag: string;
  statusMessage?: string;
};

export default function FriendItem({ avatar, nickname, tag, statusMessage }: FriendItemProps) {
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E0E2E9",
  },
  details: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F222C",
  },
  tag: {
    fontSize: 13,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  statusMessage: {
    fontSize: 12,
    color: "#717680",
  },
});
