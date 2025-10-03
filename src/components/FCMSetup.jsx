// src/components/FCMSetup.jsx
"use client";

import { useEffect } from "react";
import { getFirebaseMessaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

// shyiramo VAPID public key yawe hano (copy from Firebase Console)
const VAPID_KEY = "YOUR_VAPID_PUBLIC_KEY_FROM_CONSOLE";

export default function FCMSetup() {
  useEffect(() => {
    const setup = async () => {
      if (!("serviceWorker" in navigator)) {
        console.warn("Service workers not supported");
        return;
      }

      try {
        // register service worker
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("SW registered:", registration);

        // get messaging (client only)
        const messaging = getFirebaseMessaging();
        if (!messaging) return;

        // ask permission
        const perm = await Notification.requestPermission();
        if (perm !== "granted") {
          console.warn("Notification permission not granted");
          return;
        }

        // get token (vapid key required)
        const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
        if (token) {
          // save token in Firestore (doc id = token)
          await setDoc(doc(db, "fcmTokens", token), {
            uid: auth?.currentUser?.uid || null,
            createdAt: serverTimestamp()
          });
          console.log("Saved FCM token:", token);
        }

        // handle messages while app is foreground
        onMessage(messaging, (payload) => {
          console.log("Message received in foreground:", payload);
          const title = payload.notification?.title || "New post";
          const body = payload.notification?.body || "";
          if (Notification.permission === "granted") {
            new Notification(title, { body, icon: "/logo.png" });
          }
        });
      } catch (err) {
        console.error("FCM setup error:", err);
      }
    };

    setup();
  }, []);

  return null;
}
