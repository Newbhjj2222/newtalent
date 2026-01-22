// pages/api/pay.js
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    // =========================
    // 🔴 PAWAPAY LIVE API KEY
    // =========================
    const PAWAPAY_API_KEY = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

    // =========================
    // 🔴 LIVE PAYMENT PAGE URL
    // =========================
    const PAWAPAY_URL =
      "https://api.pawapay.io/v1/widget/sessions";

    // ID idasubirwaho ya payment
    const depositId = randomUUID();

    const payload = {
      depositId: depositId,
      amount: amount.toString(), // ex: "5000"
      country: "RWA",
      reason: "Live website payment",
      statementDescription: "ONLINE PAYMENT",
      language: "EN",

      // URL user asubiramo nyuma yo kwishyura
      returnUrl: "https://yourdomain.com/payment-result"
    };

    const response = await fetch(PAWAPAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAWAPAY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        message: "PawaPay LIVE error",
        error: data,
      });
    }

    if (!data.redirectUrl) {
      return res.status(400).json({
        message: "LIVE: redirectUrl not returned",
        data,
      });
    }

    // =========================
    // ✅ REDIRECT URL
    // =========================
    return res.status(200).json({
      redirectUrl: data.redirectUrl,
      depositId,
    });
  } catch (error) {
    console.error("LIVE PAY ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
