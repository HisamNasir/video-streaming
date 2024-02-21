import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDuVI-3Y-ohhzaEUghVUDPIZ9f6z9OJShM",

  authDomain: "video-stream-a4f37.firebaseapp.com",

  projectId: "video-stream-a4f37",

  storageBucket: "video-stream-a4f37.appspot.com",

  messagingSenderId: "1087018758659",

  appId: "1:1087018758659:web:f9b042eb16b52c0a7fd436",

  measurementId: "G-JSGRRZ7L4N",

  // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { app, auth, firestore, storage };
