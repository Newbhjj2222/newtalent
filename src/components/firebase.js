// src/components/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvwNyhKiKFyI-r6MDDk7BH3iq7P61z594",
  authDomain: "newtalents-a7c29.firebaseapp.com",
  databaseURL: "https://newtalents-a7c29-default-rtdb.firebaseio.com",
  projectId: "newtalents-a7c29",
  storageBucket: "newtalents-a7c29.appspot.com",
  messagingSenderId: "507408992610",
  appId: "1:507408992610:web:05ce220a4cb4922de9843b",
  measurementId: "G-XZVMTFEQBE"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
