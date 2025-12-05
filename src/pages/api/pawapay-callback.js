import { db } from "../../components/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

// Token yawe ya PawaPay ntabwo ikenewe hano kuko webhook izajya ihita yoherezwa na PawaPay
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const payload = req.body;

    // Payload ishobora kuba iri mu form: depositId, username, nesPoints, status
    const { username, nesPoints, status } = payload;

    if (!username || !nesPoints || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check status
    if (status !== "SUCCESS") {
      // User ntabayemo NES niba payment itarangiye neza
      return res.status(200).json({ message: "Payment not successful, NES not added" });
    }

    // Fata doc ya user muri depositers
    const userRef = doc(db, "depositers", username);

    // Iyongerere NES
    await updateDoc(userRef, {
      nes: increment(nesPoints)
    });

    return res.status(200).json({ message: `Payment successful, ${nesPoints} NES added to ${username}` });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
}
