import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="chat-tab">
      <Tabs.Screen
        name="chat-tab"
        options={{
          title: "채팅",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>💬</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="more-tab"
        options={{
          title: "더보기",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>⋯</Text>
          ),
        }}
      />
    </Tabs>
  );
}
