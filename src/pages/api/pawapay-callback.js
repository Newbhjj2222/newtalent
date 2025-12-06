// pages/api/pawapay-callback.js
import { db } from "../../components/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

export default async function handler(req, res) {
  try {
    // Accept ALL methods (POST, GET, PUT, PATCH...)
    const method = req.method;

    // Try reading JSON body, if empty fallback to query or text
    let data = req.body;

    if (!data || Object.keys(data).length === 0) {
      // try query
      if (Object.keys(req.query).length > 0) {
        data = req.query;
      } else {
        // try text body
        try {
          const raw = await new Promise((resolve) => {
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => resolve(body));
          });

          try {
            data = JSON.parse(raw);
          } catch (err) {
            const params = new URLSearchParams(raw);
            data = Object.fromEntries(params);
          }
        } catch (e) {
          data = {};
        }
      }
    }

    console.log("📌 CALLBACK DATA:", data);

    // Extract depositId
    const depositId =
      data.depositId ||
      data.id ||
      data.reference ||
      data.transactionId ||
      null;

    // Extract payment status
    const status =
      data.status ||
      data.state ||
      data.paymentStatus ||
      null;

    // Extract metadata
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
        method,
      });
    }

    // Success statuses accepted by PawaPay
    const successStates = [
      "success",
      "successful",
      "completed",
      "paid",
      "ok"
    ];

    if (!successStates.includes(String(status).toLowerCase())) {
      return res.status(200).json({
        message: `Payment not successful`,
        depositId,
        status,
        method,
      });
    }

    if (!username || !nes) {
      return res.status(200).json({
        message: "Payment success but username or nes missing",
        depositId,
      });
    }

    // Firestore update
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
      method,
    });

  } catch (err) {
    console.error("🔥 CALLBACK ERROR:", err);
    return res.status(500).json({
      message: "Callback internal error",
      error: err.message,
    });
  }
}
