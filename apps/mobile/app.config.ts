/// <reference types="node" />
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "arena",
  slug: "arena",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "arena",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "app.sandori.arena",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    // @ts-ignore — Expo SDK 54 지원
    edgeToEdgeEnabled: true,
    // @ts-ignore
    predictiveBackGestureEnabled: false,
    package: "app.sandori.arena",
  },
  web: {
    output: "static" as const,
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-sqlite",
    [
      "expo-build-properties",
      {
        ios: { useFrameworks: "static" },
      },
    ],
    "@react-native-google-signin/google-signin",
    [
      "@react-native-seoul/kakao-login",
      {
        kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    kakaoNativeAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  },
});
