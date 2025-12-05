import { db } from "../../components/firebase";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    // Only POST allowed (PawaPay requires POST)
    if (req.method !== "POST") {
      console.warn(`Received ${req.method} request, expected POST`);
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const payload = req.body || {};
    console.log("PawaPay Callback Payload:", JSON.stringify(payload, null, 2));

    // Dynamic extraction
    let username = payload.username;
    let nesPoints = payload.nesPoints;
    let status = payload.status;

    // Extract from metadata array if exists
    if ((!username || !nesPoints) && Array.isArray(payload.metadata)) {
      payload.metadata.forEach(item => {
        if (item.username) username = item.username;
        if (item.nesPoints) nesPoints = item.nesPoints;
      });
    }

    // Extract from clientReferenceId (format "username__nesPoints")
    if ((!username || !nesPoints) && payload.clientReferenceId) {
      const parts = payload.clientReferenceId.split("__");
      if (parts.length === 2) {
        username = username || parts[0];
        nesPoints = nesPoints || Number(parts[1]);
      }
    }

    // Ensure nesPoints is a number
    nesPoints = Number(nesPoints);

    // If required fields missing, respond 200 but log warning
    if (!username || !nesPoints || !status) {
      console.warn("Webhook received but missing fields after extraction");
      return res.status(200).json({ message: "Webhook received but missing fields" });
    }

    // Only process successful payments
    if (status !== "SUCCESS") {
      return res.status(200).json({ message: "Payment not successful, NES not added" });
    }

    // Reference to Firestore doc
    const userRef = doc(db, "depositers", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new doc if not exists
      await setDoc(userRef, { nes: nesPoints });
    } else {
      // Increment existing nes field
      await updateDoc(userRef, { nes: increment(nesPoints) });
    }

    console.log(`Added ${nesPoints} NES to ${username}`);
    return res.status(200).json({ message: `Payment successful, ${nesPoints} NES added for ${username}` });

  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ error: err.message });
  }
}
