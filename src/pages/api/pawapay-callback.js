import { db } from "../../components/firebase";
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({});
    }

    // PawaPay JSON body
    const event = req.body;

    console.log("📌 CALLBACK RECEIVED:", event);

    // Extract important fields
    const status = event.status;
    const metadata = event.metadata || {};

    const username = metadata.username;
    const nes = metadata.nes;

    // Credit NES only if COMPLETED
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

    // 🔥 IMPORTANT:
    // Return EXACTLY what PawaPay sent (raw event)
    return res.status(200).json(event);

  } catch (error) {
    console.error("🔥 CALLBACK ERROR:", error);

    // Even on error return empty JSON so provider stops retries
    return res.status(200).json({});
  }
}
