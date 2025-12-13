// pages/api/success.js

import { db } from "@/components/firebase";
import { doc, setDoc } from "firebase/firestore";
import { serverTimestamp, firestoreIncrement } from "@/components/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { secret, customerId, amount, status, token } = req.body;

  // 🔐 Secret ihamye (nta env)
  if (secret !== "NEWTALENTS_PHP_TO_NEXT_2025") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (status !== "COMPLETED") {
    return res.status(400).json({ error: "Transaction not completed" });
  }

  if (!customerId || !amount) {
    return res.status(400).json({ error: "Missing data" });
  }

  let nes = 0;
  let plan = "none";

  switch (Number(amount)) {
    case 10:  nes = 1;   plan = "Daily"; break;
    case 150: nes = 15;  plan = "Daily"; break;
    case 250: nes = 25;  plan = "Weekly"; break;
    case 500: nes = 60;  plan = "Monthly"; break;
    case 800: nes = 1000; plan = "BestReader"; break;
    default:
      return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const ref = doc(db, "depositers", customerId);

    await setDoc(ref, {
      nes: firestoreIncrement(nes),
      plan,
      last_payment_token: token,
      updated_at: serverTimestamp(),
    }, { merge: true });

    return res.json({
      success: true,
      nes,
      plan
    });

  } catch (error) {
    console.error("Firestore error:", error);
    return res.status(500).json({ error: "Firestore update failed" });
  }
}
