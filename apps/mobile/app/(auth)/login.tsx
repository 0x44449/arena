import apiClient from "@/api/api-client";
import { supabase } from "@/libs/supabase";
import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import * as KakaoLogin from "@react-native-seoul/kakao-login";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const webClientId = Constants.expoConfig?.extra?.googleWebClientId;
    if (webClientId) {
      GoogleSignin.configure({ webClientId });
    }
  }, []);

  // 로그인 성공 후 백엔드 유저 자동 등록
  const ensureUserRegistered = async (name: string) => {
    try {
      const { data: meResult } = await apiClient.get("/api/v1/users/me");
      if (meResult.data) return; // 이미 등록됨
    } catch {
      // 조회 실패 시 등록 시도
    }

    try {
      await apiClient.post("/api/v1/users", { name });
    } catch {
      // 첫 등록 실패는 무시 — 다음 앱 진입 시 재시도
    }
  };

  const handleKakaoLogin = async () => {
    setLoading(true);
    try {
      const result = await KakaoLogin.login();
      const idToken = result.idToken;
      if (!idToken) {
        Alert.alert("로그인 실패", "카카오 ID 토큰을 받지 못했습니다.");
        return;
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "kakao",
        token: idToken,
      });

      if (error) {
        Alert.alert("로그인 실패", error.message);
        return;
      }

      const name =
        data.user?.user_metadata?.full_name ??
        data.user?.user_metadata?.name ??
        "사용자";
      await ensureUserRegistered(name);
    } catch (e: any) {
      Alert.alert("로그인 실패", e.message ?? "카카오 로그인 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      if (!idToken) {
        Alert.alert("로그인 실패", "구글 ID 토큰을 받지 못했습니다.");
        return;
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) {
        Alert.alert("로그인 실패", error.message);
        return;
      }

      const name =
        data.user?.user_metadata?.full_name ??
        data.user?.user_metadata?.name ??
        "사용자";
      await ensureUserRegistered(name);
    } catch (e: any) {
      Alert.alert("로그인 실패", e.message ?? "구글 로그인 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Arena</Text>
        <Text style={styles.subtitle}>소규모 조직을 위한 경량 그룹웨어</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, styles.kakaoButton]}
          onPress={handleKakaoLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.kakaoText}>카카오로 시작하기</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.googleText}>Google로 시작하기</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#687076",
  },
  buttons: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  kakaoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#191919",
  },
  googleButton: {
    backgroundColor: "#F2F2F2",
  },
  googleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F1F1F",
  },
});
