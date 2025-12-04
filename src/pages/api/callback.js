// pages/api/callback.js

import { db } from "../../components/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const data = req.body;

    console.log("POWERPAY CALLBACK:", data);

    // PowerPay returns something like:
    // external_reference: "admin__monthly__500"

    const [username, plan, amount] = data.external_reference.split("__");

    // Nes credits by plan
    let nesToAdd = 0;
    switch (plan) {
      case "onestory": nesToAdd = 1; break;
      case "Daily": nesToAdd = 15; break;
      case "weekly": nesToAdd = 25; break;
      case "monthly": nesToAdd = 60; break;
      case "bestreader": nesToAdd = 100; break; // Wishatse ushobora kubihindura
      default: nesToAdd = 0;
    }

    // Update Firestore
    const ref = doc(db, "depositers", username);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const oldNes = snap.data().nes || 0;
      await setDoc(ref, {
        nes: oldNes + nesToAdd,
        lastPayment: new Date(),
        lastPlan: plan
      }, { merge: true });
    } else {
      await setDoc(ref, {
        nes: nesToAdd,
        lastPayment: new Date(),
        lastPlan: plan
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Callback error:", error);
    return res.status(500).json({ error: "Server callback error" });
  }
}
