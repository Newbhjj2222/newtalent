import { db } from "../../components/firebase";
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ message: "OK" });
    }

    // PawaPay already sends JSON, Next.js parses it automatically
    const event = req.body;

    console.log("📌 CALLBACK RECEIVED:", event);

    // -----------------------------
    // Extract depositId and status
    // -----------------------------
    const depositId = event.depositId || event.id || null;
    const status = event.status || null;

    // Metadata from PawaPay
    const metadata = event.metadata || {};
    const username = metadata.username;
    const nes = metadata.nes;

    // -----------------------------
    // If COMPLETED → add NES
    // -----------------------------
    if (status === "COMPLETED" && username && nes) {
      const userRef = doc(db, "depositers", username);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        await setDoc(userRef, { nes: Number(nes) });
      } else {
        await updateDoc(userRef, {
          nes: increment(Number(nes)),
        });
      }
    }

    // -----------------------------
    // IMPORTANT:
    // Return EXACTLY what PawaPay sent
    // -----------------------------
    return res.status(200).json(event);

  } catch (error) {
    console.error("🔥 CALLBACK ERROR:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
}
