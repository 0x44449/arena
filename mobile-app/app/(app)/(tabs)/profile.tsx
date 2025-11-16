import { useArenaStore } from "@/stores/arena";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const signOut = useArenaStore((state) => state.signOut);
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Sign out" onPress={() => signOut()} />
      </View>
    </SafeAreaView>
  )
}