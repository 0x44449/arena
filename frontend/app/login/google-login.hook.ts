import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function useGoogleLogin() {
  const loginWithGoogle = async () => {
    const firebaseConfig = {
      apiKey: "AIzaSyA17PmJhus0_6u_P4c0OLcqov15gE-4_rM",
      // authDomain: "arena-538a6.firebaseapp.com",
      authDomain: "arena-dev.com",
      projectId: "arena-538a6",
      storageBucket: "arena-538a6.firebasestorage.app",
      messagingSenderId: "665740865863",
      appId: "1:665740865863:web:79f440db4cfca634bd9c62",
      measurementId: "G-W5NNJJ2FGG"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);

    const idToken = await credential.user.getIdToken();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({
        provider: 'google',
        token: idToken,
      })
    });
  }

  return {
    loginWithGoogle,
  };
}