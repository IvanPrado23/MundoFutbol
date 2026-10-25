import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** true cuando las variables de entorno de Firebase están configuradas. */
export const isFirebaseEnabled = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;

function getApp(): FirebaseApp {
  if (!isFirebaseEnabled) throw new Error("Firebase no está configurado");
  if (!app) app = getApps()[0] ?? initializeApp(config);
  return app;
}

export const db = (): Firestore => getFirestore(getApp());
export const auth = (): Auth => getAuth(getApp());
