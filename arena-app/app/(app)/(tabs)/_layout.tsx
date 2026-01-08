import FloatingTabBar from "@/components/FloatingTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      initialRouteName="friend-tab"
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="friend-tab" />
      <Tabs.Screen name="chat-tab" />
      <Tabs.Screen name="more-tab" />
    </Tabs>
  );
}
