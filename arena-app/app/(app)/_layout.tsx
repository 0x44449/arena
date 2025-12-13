import { useUserGetMeQuery } from "@/api/generated/endpoints/user/user";
import { supabase } from "@/libs/supabase";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

export default function AppLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { data: me, isLoading: isLoadingMe } = useUserGetMeQuery({
    query: { staleTime: Infinity, gcTime: Infinity }
  });

  // useEffect(() => {
  //   if (!isLoadingMe && !me && segments[1] !== "welcome") {
  //     router.replace("/welcome");
  //   }
  // }, [segments, me, isLoadingMe]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        supabase.auth.startAutoRefresh();
      }
      else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="welcome" />
    </Stack>
  )
} 