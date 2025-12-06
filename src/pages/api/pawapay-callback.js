// pages/api/pawapay-callback.js
import { db } from "../../components/firebase";
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";

export const config = {
  api: {
    bodyParser: false, // Tugenda dusoma raw body kugira ngo dukire POST yose ya PawaPay
  },
};

// Helper to read raw body
async function readStream(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });
}

export default async function handler(req, res) {
  try {
    const rawBody = await readStream(req);
    let event = null;

    // Try JSON
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      // Try form-urlencoded
      try {
        const params = new URLSearchParams(rawBody);
        event = Object.fromEntries(params);
      } catch (e2) {
        event = {};
      }
    }

    console.log("📌 RAW CALLBACK BODY:", rawBody);
    console.log("📌 PARSED EVENT:", event);

    // ---------------------------------------
    // 1. Check required fields
    // ---------------------------------------
    const depositId =
      event.depositId ||
      event.id ||
      event.transactionId ||
      event.reference ||
      null;

    const status =
      event.status ||
      event.state ||
      event.paymentStatus ||
      null;

    const username = event.username || event.user || null;
    const nes = event.nes || event.points || null;

    if (!depositId) {
      return res.status(200).json({
        message: "Callback received but no depositId found",
      });
    }

    // ---------------------------------------
    // 2. Only credit NES if payment completed
    // ---------------------------------------
    const successStates = ["success", "successful", "completed", "paid"];

    if (!successStates.includes(String(status).toLowerCase())) {
      return res.status(200).json({
        message: `Payment NOT successful. Current state = ${status}`,
      });
    }

    // ---------------------------------------
    // 3. We MUST have username + nes passed in metadata
    // ---------------------------------------
    if (!username || !nes) {
      return res.status(200).json({
        message: "Payment success but username or NES missing in metadata",
      });
    }

    // ---------------------------------------
    // 4. Update Firestore
    // ---------------------------------------
    const userRef = doc(db, "depositers", username);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      // Create doc if missing
      await setDoc(userRef, { nes: Number(nes) });
    } else {
      // Increase NES amount
      await updateDoc(userRef, {
        nes: increment(Number(nes)),
      });
    }

    return res.status(200).json({
      message: `Payment successful, ${nes} NES added for ${username}`,
      depositId,
      status,
    });
  } catch (error) {
    console.error("🔥 CALLBACK ERROR:", error);
    return res.status(500).json({
      message: "Internal callback error",
      error: error.message,
    });
  }
}
