import { auth } from "@/plugins/firebase.plugin";
import { Auth, browserLocalPersistence, getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";

export default function useGoogleLogin() {
  // useEffect(() => {
  //   console.log('useGoogleLogin hook initialized');
  //   const unsubscribe = onAuthStateChanged(auth, (u) => {
  //     console.log('Auth state changed:', auth);
  //   });
  //   return () => unsubscribe();
  // }, [auth]);

  const loginWithGoogle = async () => {
    console.log('Attempting Google login...');
    await setPersistence(auth, browserLocalPersistence);
    
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    return credential.user;
  }

  return {
    loginWithGoogle,
  };
}