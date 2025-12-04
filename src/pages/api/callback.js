import { db } from "../../components/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
  // Koresha POST gusa
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Buri content type: JSON cyangwa URL-encoded
    let body = req.body;

    // Fallback: niba req.body ari empty (PowerPay yohereje raw text)
    if (!body || Object.keys(body).length === 0) {
      const raw = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => resolve(data));
        req.on("error", err => reject(err));
      });

      try {
        body = JSON.parse(raw);
      } catch {
        // niba atari JSON, yubika raw string
        body = { raw };
      }
    }

    console.log("POWERPAY CALLBACK BODY:", body);

    // Example: on successful payment, auto add NeS
    if (body.status === "SUCCESS") {
      const [username, plan, amount] = body.external_reference.split("__");

      let nesToAdd = 0;
      switch (plan) {
        case "onestory": nesToAdd = 1; break;
        case "Daily": nesToAdd = 15; break;
        case "weekly": nesToAdd = 25; break;
        case "monthly": nesToAdd = 60; break;
        case "bestreader": nesToAdd = 100; break;
      }

      const ref = doc(db, "depositers", username);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const oldNes = snap.data().nes || 0;
        await setDoc(ref, { nes: oldNes + nesToAdd }, { merge: true });
      } else {
        await setDoc(ref, { nes: nesToAdd }, { merge: true });
      }
    }

    // Always return 200 to PowerPay
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error("Callback processing error:", error);
    return res.status(500).json({ error: "Server callback error" });
  }
}
