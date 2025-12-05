import { db } from "../../components/firebase";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const payload = req.body;

    // PawaPay webhook payload expected fields
    // Ensure your metadata or body includes username, nesPoints, status
    const { username, nesPoints, status } = payload;

    if (!username || !nesPoints || !status) {
      return res.status(400).json({ error: "Missing required fields in webhook payload" });
    }

    // Only process if payment was successful
    if (status !== "SUCCESS") {
      return res.status(200).json({ message: "Payment not successful, NES not added" });
    }

    // Reference to user doc
    const userRef = doc(db, "depositers", username);

    // Check if doc exists
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // If not, create new doc with nes = nesPoints
      await setDoc(userRef, { nes: nesPoints });
    } else {
      // Increment existing nes field
      await updateDoc(userRef, {
        nes: increment(nesPoints)
      });
    }

    // Return success to PawaPay
    return res.status(200).json({ message: `Payment successful, ${nesPoints} NES added for ${username}` });

  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ error: err.message });
  }
}
