import { db } from "../../components/firebase";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const payload = req.body || {}; // fallback niba body ari undefined

    // If GET request, try parsing query params too
    if (req.method === "GET") {
      Object.assign(payload, req.query);
    }

    console.log("Webhook method:", req.method);
    console.log("Payload received:", JSON.stringify(payload, null, 2));

    // Dynamic extraction: check common places where PawaPay might send data
    let username = payload.username;
    let nesPoints = payload.nesPoints;
    let status = payload.status;

    // Try extracting from metadata array if available
    if ((!username || !nesPoints) && Array.isArray(payload.metadata)) {
      payload.metadata.forEach(item => {
        if (item.username) username = item.username;
        if (item.nesPoints) nesPoints = item.nesPoints;
      });
    }

    // Try extracting from clientReferenceId or custom fields if needed
    // Example: clientReferenceId might contain username and nesPoints
    if ((!username || !nesPoints) && payload.clientReferenceId) {
      // assuming format "username__nesPoints"
      const parts = payload.clientReferenceId.split("__");
      if (parts.length === 2) {
        username = username || parts[0];
        nesPoints = nesPoints || Number(parts[1]);
      }
    }

    // Ensure nesPoints is a number
    nesPoints = Number(nesPoints);

    // Check final required fields
    if (!username || !nesPoints || !status) {
      console.warn("Webhook received but missing fields after extraction");
      return res.status(200).json({ message: "Webhook received but missing fields" });
    }

    // Only process successful payments
    if (status !== "SUCCESS") {
      return res.status(200).json({ message: "Payment not successful, NES not added" });
    }

    const userRef = doc(db, "depositers", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, { nes: nesPoints });
    } else {
      await updateDoc(userRef, {
        nes: increment(nesPoints)
      });
    }

    return res.status(200).json({ message: `Payment successful, ${nesPoints} NES added for ${username}` });

  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ error: err.message });
  }
}
