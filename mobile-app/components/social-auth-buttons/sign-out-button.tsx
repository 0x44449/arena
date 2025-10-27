import { supabase } from "@/lib/supabase";
import { Button } from "react-native";

export default function SignOutButton() {
  const handleSignOutButtonPress = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }

  return <Button title="Sign Out" onPress={handleSignOutButtonPress} />
}