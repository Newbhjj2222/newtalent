// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase Messaging
export const messaging = getMessaging(app);

/**
 * Request notification permission and get FCM token
 * Returns the token if permission granted
 */
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: 'BLAZpHH-ZaiyK7-qS1mkoTY63ZuZOXRxBAXq4a4ZWwamvKUHKu84ZG7UNFciCGz7tBfMBZvK994Ip5Y1rfkfOjg'
      });
      console.log("✅ FCM Token:", token);
      // Hano ushobora kongeramo function yo kubika token muri Firestore
      return token;
    } else {
      console.warn("⚠️ Notification permission not granted");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};

// Handle messages when app is in foreground
onMessage(messaging, (payload) => {
  console.log("📩 Foreground message received: ", payload);
  if (payload.notification) {
    const { title, body } = payload.notification;
    new Notification(title, { body });
  }
});
