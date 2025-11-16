import { Image } from "expo-image";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Header() {
  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, alignItems: "center", backgroundColor: "red" }}>
      {/* <TouchableOpacity style={{ padding: 5, marginRight: 12 }}>
          <AntDesign name="menu" size={30} color="black" />
        </TouchableOpacity> */}
      <Image
        style={{ width: 40, height: 40, borderRadius: 8, marginRight: 12 }}
        source={"https://picsum.photos/id/10/200"}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>채널명</Text>
    </View>
  )
}

export default function Team() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1 }}>
        {/* Team Content */}
      </View>
    </SafeAreaView>
  )
}