import { auth } from "@/plugins/firebase.plugin";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function useGoogleLogin() {
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    return credential.user;
  }

  return {
    loginWithGoogle,
  };
}