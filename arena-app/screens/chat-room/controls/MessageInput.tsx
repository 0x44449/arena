import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MessageInput() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardStickyView
      style={[styles.sticky, { bottom: insets.bottom }]}
      offset={{ closed: 0, opened: insets.bottom - 8 }}
    >
      <View style={styles.container}>
        <BlurView intensity={20} tint="light" style={styles.blurContainer}>
          <View style={styles.inputRow}>
            <Pressable style={styles.iconButton}>
              <Feather name="plus" size={22} color="#6B7280" />
            </Pressable>
            <TextInput
              style={styles.textInput}
              placeholder="메시지 입력..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <Pressable style={styles.sendButton}>
              <Feather name="send" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </BlurView>
      </View>
    </KeyboardStickyView>
  );
}

const styles = StyleSheet.create({
  sticky: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  container: {
    marginHorizontal: 16,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E2128",
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3C6DF0",
    alignItems: "center",
    justifyContent: "center",
  },
});
