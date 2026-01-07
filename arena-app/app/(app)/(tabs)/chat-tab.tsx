import { CS } from "@/libs/common-style";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/screens/chat-tab/Header";
import ChannelList from "@/screens/chat-tab/ChannelList";

export default function ChatTab() {
  return (
    <SafeAreaView style={[CS.flex1, CS.bgWhite]} edges={["top", "left", "right"]}>
      <Header />
      <ChannelList />
    </SafeAreaView>
  );
}
