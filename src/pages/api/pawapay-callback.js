// pages/api/pawapay-callback.js
import { db } from "../../components/firebase";
import { doc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const callbackData = req.body;

    console.log("PAWAPAY CALLBACK:", callbackData);

    const { request_id, status, reference, failure_reason, metadata } = callbackData;
    const userId = metadata?.userId || "unknown-user";

    // Save callback to Firestore
    await setDoc(doc(db, "pawapay_callbacks", request_id), {
      userId,
      requestId: request_id,
      status,
      reference,
      failure_reason: failure_reason || null,
      timestamp: Date.now()
    });

    // Always return 200 to Pawapay
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Callback processing error:", error);
    return res.status(500).json({ error: "Callback failed" });
  }
}
