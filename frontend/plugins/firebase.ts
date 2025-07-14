// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };