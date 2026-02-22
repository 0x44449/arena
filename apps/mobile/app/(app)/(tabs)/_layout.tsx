import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="chat-tab">
      <Tabs.Screen
        name="chat-tab"
        options={{ title: "채팅" }}
      />
      <Tabs.Screen
        name="more-tab"
        options={{ title: "더보기" }}
      />
    </Tabs>
  );
}
