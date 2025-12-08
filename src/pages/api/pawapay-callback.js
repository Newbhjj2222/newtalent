import { db } from "../../components/firebase";
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ message: "Callback received" });
    }

    const event = req.body; // Next.js already parsed JSON

    console.log("📌 CALLBACK BODY:", event);

    // 1. Get depositId
    const depositId = event.depositId || event.id || null;
    if (!depositId) {
      return res.status(200).json({ message: "No depositId provided" });
    }

    // 2. Check status
    const status = event.status || null;
    if (!status) {
      return res.status(200).json({ message: "No status provided" });
    }

    if (status !== "COMPLETED") {
      return res.status(200).json({
        message: `Deposit not completed. Status = ${status}`,
      });
    }

    // 3. Metadata
    const metadata = event.metadata || {};
    const username = metadata.username;
    const nes = metadata.nes;

    if (!username || !nes) {
      return res.status(200).json({
        message: "COMPLETED but metadata missing username or nes",
      });
    }

    // 4. Firestore update
    const userRef = doc(db, "depositers", username);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, { nes: Number(nes) });
    } else {
      await updateDoc(userRef, {
        nes: increment(Number(nes)),
      });
    }

    return res.status(200).json({
      message: `Deposit completed: +${nes} NES for ${username}`,
      depositId,
    });
  } catch (error) {
    console.error("🔥 CALLBACK ERROR:", error);
    return res.status(500).json({
      message: "Callback internal error",
      error: error.message,
    });
  }
}
