import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="profile-tab">
      <Tabs.Screen name="profile-tab" options={{ title: "Profile", tabBarLabel: "Profile" }} />
    </Tabs>
  )
}