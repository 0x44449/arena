import { CS } from "@/libs/common-style";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AVATAR_SOURCES = [
  require("@/assets/images/icon.png"),
  require("@/assets/images/react-logo.png"),
  require("@/assets/images/partial-react-logo.png"),
] as const;

const NICKNAME_MAX = 16;

export default function Welcome() {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTag = useMemo(() => "#111", []);
  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= NICKNAME_MAX;
  const isReady = isNicknameValid;

  const handleCycleAvatar = () => {
    setAvatarIndex((current) => (current + 1) % AVATAR_SOURCES.length);
  };

  const handleSubmit = async () => {
    if (!isReady) return;
    setIsSubmitting(true);
    try {
      // API 연결 시 이 지점에서 백엔드와 통신하도록 변경
      Alert.alert("프로필 저장", `${userTag}에게 환영 인사를 전했어요!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[CS.flex1, CS.bgWhite]}>
      <KeyboardAvoidingView
        style={CS.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
          <ScrollView
            style={CS.flex1}
            contentContainerStyle={styles.scrollBody}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[CS.flex1, styles.container]}>
              <View style={styles.textSection}>
                <Text style={styles.welcomeTitle}>환영합니다</Text>
                <Text style={styles.subtitle}>
                  메신저에 오신 것을 환영해요. 사용하실 모습을 가볍게 정리해 볼까요?
                </Text>
              </View>

              <View style={styles.avatarSection}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.avatarButton}
                  onPress={handleCycleAvatar}
                >
                  <Image
                    source={AVATAR_SOURCES[avatarIndex]}
                    style={styles.avatarImage}
                  />
                  <View style={styles.avatarBadge}>
                    <Text style={styles.avatarBadgeText}>변경</Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.helper}>
                  가볍게 터치해서 다른 분위기를 확인할 수 있어요.
                </Text>
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>닉네임</Text>
                <View
                  style={[
                    styles.input,
                    styles.nicknameRow,
                    !isNicknameValid && trimmedNickname.length > 0
                      ? styles.inputError
                      : undefined,
                  ]}
                >
                  <TextInput
                    style={styles.nicknameInput}
                    placeholder="닉네임을 입력해주세요"
                    placeholderTextColor="#9AA0B0"
                    value={nickname}
                    onChangeText={setNickname}
                    maxLength={NICKNAME_MAX}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                  />
                  <Text style={styles.tagValue}>{userTag}</Text>
                </View>
                <View style={styles.helperRow}>
                  <Text style={styles.helper}>
                    2~{NICKNAME_MAX}자 사이로 입력해주세요.
                  </Text>
                  <Text style={styles.helperCount}>
                    {trimmedNickname.length}/{NICKNAME_MAX}
                  </Text>
                </View>
              </View>

              <View>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !isReady || isSubmitting ? styles.submitButtonDisabled : null,
                  ]}
                  activeOpacity={0.9}
                  disabled={!isReady || isSubmitting}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitText}>
                    {isSubmitting ? "저장 중..." : "시작하기"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollBody: {
    flexGrow: 1,
  },
  container: { flex: 1, paddingHorizontal: 24, paddingVertical: 32, gap: 32 },
  welcomeTitle: {
    color: "#2C2F36",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#5B5F6B",
    marginBottom: 6,
  },
  avatarSection: {
    alignItems: "center",
    gap: 12,
  },
  textSection: {
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2127",
  },
  helper: {
    fontSize: 13,
    color: "#868C98",
  },
  avatarButton: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: "#F1F2F6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 999,
  },
  avatarBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  inputBlock: { gap: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#E2E4E9",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2127",
  },
  nicknameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputError: {
    borderColor: "#F43F5E",
  },
  nicknameInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2127",
  },
  tagValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  helperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helperCount: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#384BFF",
  },
  submitButtonDisabled: {
    backgroundColor: "#B8BFF8",
  },
  submitText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
