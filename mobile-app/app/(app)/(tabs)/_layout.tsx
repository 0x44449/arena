import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="channel-list">
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
          tabBarLabel: "친구",
          tabBarBadge: undefined,
        }}
      />
      <Tabs.Screen
        name="channel-list"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="message" size={size} color={color} />
          ),
          tabBarLabel: "대화",
          tabBarBadge: 3,
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="team" size={size} color={color} />
          ),
          tabBarLabel: "팀",
          tabBarBadge: undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
          tabBarLabel: "프로필",
          tabBarBadge: undefined,
        }}
      />
    </Tabs>
  )
}