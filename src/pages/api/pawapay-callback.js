// pages/api/pawapay-callback.js
import { db } from "../../components/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

export const config = {
  api: {
    bodyParser: false, // Dukoresha raw reader kugira ngo dufate POST yose
  },
};

// Gusoma raw body yose
async function readRawBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
  });
}

export default async function handler(req, res) {
  try {
    const rawBody = await readRawBody(req);
    console.log("📌 RAW CALLBACK BODY:", rawBody);

    let data = {};

    // Try decode JSON
    try {
      data = JSON.parse(rawBody);
    } catch (e) {
      try {
        // Try URL-encoded
        const params = new URLSearchParams(rawBody);
        data = Object.fromEntries(params);
      } catch (e2) {
        data = {};
      }
    }

    console.log("📌 PARSED CALLBACK:", data);

    //-------------------------------
    // 1. Extract Deposit ID
    //-------------------------------
    const depositId =
      data.depositId ||
      data.id ||
      data.paymentId ||
      data.transactionId ||
      data.reference ||
      null;

    //-------------------------------
    // 2. Extract Payment Status
    //-------------------------------
    const status =
      data.status ||
      data.state ||
      data.paymentStatus ||
      null;

    //-------------------------------
    // 3. Extract Metadata (username + nes)
    //-------------------------------
    const username =
      data.username ||
      (data.metadata && data.metadata.username) ||
      null;

    const nes =
      data.nes ||
      (data.metadata && data.metadata.nes) ||
      null;

    if (!depositId) {
      return res.status(200).json({
        message: "Callback received but depositId missing",
      });
    }

    // Success flags accepted by Pawapay
    const successStates = ["success", "successful", "completed", "paid"];

    if (!successStates.includes(String(status).toLowerCase())) {
      return res.status(200).json({
        message: `Payment not successful. Status: ${status}`,
        depositId,
      });
    }

    //-------------------------------
    // 4. Ensure metadata exists
    //-------------------------------
    if (!username || !nes) {
      return res.status(200).json({
        message:
          "Payment successful BUT metadata (username, nes) missing.",
        depositId,
      });
    }

    //-------------------------------
    // 5. Firestore Update
    //-------------------------------
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
      message: `Payment successful, ${nes} NES added for ${username}`,
      depositId,
    });
  } catch (err) {
    console.error("🔥 CALLBACK ERROR:", err);
    return res.status(500).json({
      message: "Callback internal error",
      error: err.message,
    });
  }
}
