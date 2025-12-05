import { db } from "../../components/firebase";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const payload = req.body || {}; // fallback niba body ari undefined

    // If GET request, try parsing query params
    if (req.method === "GET") {
      Object.assign(payload, req.query);
    }

    // Extract fields
    const { username, nesPoints, status } = payload;

    if (!username || !nesPoints || !status) {
      // Return 200 anyway so PawaPay doesn't retry excessively
      return res.status(200).json({ message: "Webhook received but missing fields" });
    }

    if (status !== "SUCCESS") {
      return res.status(200).json({ message: "Payment not successful, NES not added" });
    }

    const userRef = doc(db, "depositers", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, { nes: nesPoints });
    } else {
      await updateDoc(userRef, {
        nes: increment(Number(nesPoints))
      });
    }

    return res.status(200).json({ message: `Payment successful, ${nesPoints} NES added for ${username}` });

  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ error: err.message });
  }
}
