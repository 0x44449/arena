import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}