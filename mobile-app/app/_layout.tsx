// import { Slot } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// export default function Layout() {
//   return (
//     <SafeAreaProvider>
//       <Slot />
//     </SafeAreaProvider>
//   )
// }

import { useArenaStore } from "@/stores/arena";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const user = useArenaStore((state) => state.user);
  console.log("RootLayout user:", user);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={user !== null}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Protected guard={user === null}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
