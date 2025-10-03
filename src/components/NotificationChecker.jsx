"use client";

import { useEffect, useRef } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export default function NotificationChecker() {
  const lastCheckedRef = useRef(Date.now());

  useEffect(() => {
    // Saba uburenganzira bwa browser notifications
    if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const checkNewPosts = async () => {
      try {
        const lastCheckedTs = Timestamp.fromMillis(lastCheckedRef.current);
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("timestamp", ">", lastCheckedTs));
        const snap = await getDocs(q);

        snap.forEach(doc => {
          const post = doc.data();
          const title = post.title || "Post nshya!";
          const body = (post.excerpt || (post.body && post.body.slice(0,120)) || "Hari post nshya yashyizweho.");
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification(title, {
              body,
              icon: "/logo.png" // shira logo yawe niba uyifite
            });
          }
        });

        // Update lastChecked
        lastCheckedRef.current = Date.now();
      } catch (err) {
        console.error("checkNewPosts error:", err);
      }
    };

    // run immediately and then every 5 minutes
    checkNewPosts();
    const interval = setInterval(checkNewPosts, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
