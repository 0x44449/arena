import Entypo from "@expo/vector-icons/Entypo";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_ICONS: Record<string, keyof typeof Entypo.glyphMap> = {
  "friend-tab": "users",
  "chat-tab": "chat",
  "more-tab": "dots-three-horizontal",
};

const TAB_LABELS: Record<string, string> = {
  "friend-tab": "Friend",
  "chat-tab": "Chat",
  "more-tab": "More",
};

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: insets.bottom + 8 }]}>
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const iconName = TAB_ICONS[route.name] || "circle";
            const label = TAB_LABELS[route.name] || route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
              >
                <Entypo
                  name={iconName}
                  size={22}
                  color={isFocused ? "#3C6DF0" : "#9CA3AF"}
                />
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  blurContainer: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingVertical: 12,
    paddingHorizontal: 32,
    gap: 40,
  },
  tabItem: {
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  tabLabelFocused: {
    color: "#3C6DF0",
  },
});
