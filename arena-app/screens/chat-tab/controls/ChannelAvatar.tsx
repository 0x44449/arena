import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type Props = {
  avatars: (string | undefined)[];
  isGroup: boolean;
};

export default function ChannelAvatar({ avatars, isGroup }: Props) {
  if (!isGroup) {
    return (
      <Image
        source={{ uri: avatars[0] }}
        style={styles.avatarSingle}
        contentFit="cover"
      />
    );
  }

  const sliced = avatars.slice(0, 4);

  if (sliced.length === 2) {
    return (
      <View style={styles.avatarTwo}>
        <Image
          source={{ uri: sliced[0] }}
          style={[styles.avatarClusterItem, styles.avatarTwoTop]}
          contentFit="cover"
        />
        <Image
          source={{ uri: sliced[1] }}
          style={[styles.avatarClusterItem, styles.avatarTwoBottom]}
          contentFit="cover"
        />
      </View>
    );
  }

  if (sliced.length === 3) {
    return (
      <View style={styles.avatarThree}>
        <Image
          source={{ uri: sliced[0] }}
          style={[styles.avatarClusterItem, styles.avatarThreeTop]}
          contentFit="cover"
        />
        <Image
          source={{ uri: sliced[1] }}
          style={[styles.avatarClusterItem, styles.avatarThreeBottomLeft]}
          contentFit="cover"
        />
        <Image
          source={{ uri: sliced[2] }}
          style={[styles.avatarClusterItem, styles.avatarThreeBottomRight]}
          contentFit="cover"
        />
      </View>
    );
  }

  return (
    <View style={styles.avatarGrid}>
      {sliced.map((uri, index) => (
        <Image
          key={index}
          source={{ uri }}
          style={styles.avatarGridItem}
          contentFit="cover"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarSingle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0E2E9",
  },
  avatarTwo: {
    width: 60,
    height: 60,
    position: "relative",
  },
  avatarThree: {
    width: 60,
    height: 60,
    position: "relative",
  },
  avatarClusterItem: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E2E9",
    position: "absolute",
  },
  avatarTwoTop: {
    top: 6,
    left: 6,
  },
  avatarTwoBottom: {
    bottom: 6,
    right: 6,
  },
  avatarThreeTop: {
    top: 2,
    left: 16,
  },
  avatarThreeBottomLeft: {
    bottom: 4,
    left: 6,
  },
  avatarThreeBottomRight: {
    bottom: 4,
    right: 6,
  },
  avatarGrid: {
    width: 60,
    height: 60,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  avatarGridItem: {
    width: 28,
    height: 28,
    borderRadius: 6,
    margin: 1,
    backgroundColor: "#E0E2E9",
  },
});
