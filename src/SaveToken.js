// src/saveToken.js
import { auth, db, requestNotificationPermission } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const askAndSaveToken = async () => {
  try {
    const token = await requestNotificationPermission();
    if (token && auth.currentUser) {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        { fcmToken: token },
        { merge: true }
      );
      console.log("✅ Token saved to Firestore:", token);
    } else {
      console.log("⚠️ No user logged in or no token found.");
    }
  } catch (err) {
    console.error("❌ Error saving token:", err);
  }
};
