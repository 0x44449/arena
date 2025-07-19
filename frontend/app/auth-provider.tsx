'use client';

import { auth } from "@/plugins/firebase.plugin";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('Auth state changed:', u);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (isLoading) return null;
  return children;
}