import { supabase } from "@/libs/supabase";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

export default function AppLayout() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="org-list">
      <Stack.Screen name="org-list" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="member-list"
        options={{ headerShown: true, title: "멤버" }}
      />
      <Stack.Screen
        name="team-list"
        options={{ headerShown: true, title: "팀" }}
      />
      <Stack.Screen
        name="team-detail"
        options={{ headerShown: true, title: "팀 상세" }}
      />
      <Stack.Screen
        name="org-settings"
        options={{ headerShown: true, title: "조직 설정" }}
      />
    </Stack>
  );
}
