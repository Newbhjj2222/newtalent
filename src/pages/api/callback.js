import { db } from "../../components/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = "";
    await new Promise((resolve, reject) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });

    try { body = JSON.parse(body); } catch { body = { raw: body }; }

    console.log("PawaPay CALLBACK BODY:", body);

    if (body.status === "SUCCESS" && body.external_reference) {
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

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Callback error:", err);
    return res.status(500).json({ error: "Server callback error" });
  }
}
