import { useArenaStore } from "@/stores/arena";
import { Button, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const signIn = useArenaStore((state) => state.signIn);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
        <Button title="Sign In" onPress={() => signIn("exampleUser")} />
      </View>
    </SafeAreaView>
  )
}