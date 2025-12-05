// pages/api/process-deposit.js
import { db } from "../../components/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const event = req.body;

  console.log("PawaPay Callback:", event);

  try {
    if (!event || !event.status || !event.metadata) {
      return res.status(400).json({ error: "Invalid callback structure" });
    }

    const status = event.status.toLowerCase();
    const metadata = event.metadata;

    const username = metadata.find(m => m.username)?.username;
    const nesPoints = metadata.find(m => m.nesPoints)?.nesPoints;

    if (!username || !nesPoints) {
      return res.status(400).json({ error: "Missing metadata (username or nesPoints)" });
    }

    // Only reward NES if payment success
    if (status !== "successful") {
      return res.status(200).json({ message: "Payment not successful. Skipped." });
    }

    const userRef = doc(db, "depositers", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create document
      await setDoc(userRef, { nes: nesPoints });
    } else {
      // Add NES to existing balance
      const oldNes = userSnap.data().nes || 0;
      await updateDoc(userRef, { nes: oldNes + nesPoints });
    }

    return res.status(200).json({ message: "NES updated successfully" });

  } catch (err) {
    console.error("Process Deposit Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
