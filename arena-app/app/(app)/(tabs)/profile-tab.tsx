import { CS } from "@/libs/common-style";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTab() {
  return (
    <SafeAreaView style={[CS.flex1, CS.bgWhite]} edges={["top", "left", "right"]}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <Text>Profile Tab</Text>
        </View>
        <View style={{ backgroundColor: "red", height: 2000 }}></View>
        <View style={{ padding: 16 }}>
          <Text>Profile Tab</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}