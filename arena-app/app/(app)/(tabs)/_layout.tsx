import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="friend-tab">
      <Tabs.Screen name="friend-tab" options={{ title: "Friend", tabBarLabel: "Friend" }} />
      <Tabs.Screen name="chat-tab" options={{ title: "Chat", tabBarLabel: "Chat" }} />
      <Tabs.Screen name="more-tab" options={{ title: "More", tabBarLabel: "More" }} />
    </Tabs>
  )
}