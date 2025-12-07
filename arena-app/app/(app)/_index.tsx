import { CC, CL } from "@/components/styles/common";
import { supabase } from "@/libs/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppIndex() {
  const user = useAuthStore((state) => state.user)!;
  const session = useAuthStore((state) => state.session)!;

  const handleLogoutPress = async () => {
    await supabase.auth.signOut();
  }
  
  return (
    <SafeAreaView style={[CL.flex1, CC.bgWhite]}>
      <View style={{ height: 50, borderBottomColor: "#CCC", borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
          <TouchableOpacity style={{ backgroundColor: "red", width: 32, height: 32, borderRadius: 9999 }} onPress={handleLogoutPress}>
            <Image
              source={{ uri: user.user_metadata.picture }}
              style={{ width: 32, height: 32, borderRadius: 9999 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text>App Index</Text>
      </View>
    </SafeAreaView>
  )
}