// pages/api/callback.js
import { db } from "../../components/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const event = req.body;
  console.log("PawaPay callback payload:", JSON.stringify(event));

  // expected fields (adjust to actual PawaPay webhook body)
  // common: event.customer_reference, event.status, event.amount.value
  const txRef = event.customer_reference || event.data?.customer_reference || event.reference;
  const status = event.status || event.data?.status;
  const amount = event.amount?.value || event.data?.amount?.value || null;

  if (!txRef || !status) {
    console.warn("Callback missing txRef or status");
    return res.status(400).send("Invalid callback");
  }

  try {
    const txDocRef = doc(db, "transactions", txRef);
    const txSnap = await getDoc(txDocRef);
    if (!txSnap.exists()) {
      console.warn("Transaction not found:", txRef);
      // you might still want to record it somewhere
      return res.status(404).send("Transaction not found");
    }

    const tx = txSnap.data();

    // Update status
    await updateDoc(txDocRef, {
      status,
      callbackReceivedAt: new Date()
    });

    if (String(status).toLowerCase() === "successful" || String(status).toLowerCase() === "success") {
      // increment user's nes points in depositers collection
      const pointsToAdd = tx.points || 0; // points we stored when creating tx
      const deposRef = doc(db, "depositers", tx.username);
      await updateDoc(deposRef, {
        nes: increment(Number(pointsToAdd))
      });

      // mark transaction as completed
      await updateDoc(txDocRef, { completedAt: new Date() });
    }

    return res.status(200).send("OK");

  } catch (err) {
    console.error("Callback processing error:", err);
    return res.status(500).send("Server error");
  }
}
