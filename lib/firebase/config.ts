import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "prompt-to-production-b3ffb";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || `https://${projectId}-default-rtdb.firebaseio.com`,
  projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "920350590806",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:920350590806:web:cd869294cc9ac21c6bb8f7",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-07P9KECTEM",
};

export const isFirebaseConfigured = (): boolean => {
  return typeof window !== "undefined" && !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
};

export const isRtdbConfigured = (): boolean => {
  return typeof window !== "undefined" && !!(
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  );
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let rtdb: Database | null = null;

if (typeof window !== "undefined") {
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: "select_account" });
      
      // Initialize Realtime Database
      try {
        rtdb = getDatabase(app);
      } catch (dbErr) {
        console.warn("Firebase RTDB initialization note:", dbErr);
      }

      // Safe non-blocking Analytics initialization
      if (firebaseConfig.measurementId) {
        import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
          isSupported().then((supported) => {
            if (supported && app) getAnalytics(app);
          }).catch(() => {});
        }).catch(() => {});
      }
    } catch (e) {
      console.warn("Firebase client initialization error:", e);
    }
  }
}

export { app, auth, googleProvider, rtdb };
