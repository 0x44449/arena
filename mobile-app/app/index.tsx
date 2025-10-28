import GoogleSignInButton from "@/components/social-auth-buttons/google/google-sign-in-button";
import SignOutButton from "@/components/social-auth-buttons/sign-out-button";
import { useEffect } from "react";
import { Text, View } from "react-native";
import * as Linking from "expo-linking";
import { useAuthContext } from "@/hooks/use-auth-context";

export default function Index() {
  const { isLoggedIn, profile, session } = useAuthContext()
  
  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep Link URL:", url);
      // 예: myapp://auth/callback?ping=1
    });
    // 앱이 백그라운드/콜드스타트에서 실행될 때 초기 URL도 체크
    (async () => {
      const initial = await Linking.getInitialURL();
      if (initial) console.log("Initial URL:", initial);
    })();

    return () => sub.remove();
  }, []);
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>Current user: {isLoggedIn ? session?.user?.email : "Guest"}</Text>
      <GoogleSignInButton />
      <SignOutButton />
    </View>
  );
}
