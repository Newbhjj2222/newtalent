// pages/api/pay.js
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // =========================
    // FATA DATA IVA KURI FRONTEND
    // =========================
    const { amount, country } = req.body;

    if (!amount || !country) {
      return res
        .status(400)
        .json({ message: "Amount and country are required" });
    }

    // =========================
    // 🔴 PAWAPAY LIVE API KEY
    // =========================
    const PAWAPAY_API_KEY =
      "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

    // =========================
    // 🔴 PAWAPAY LIVE URL
    // =========================
    const PAWAPAY_URL =
      "https://api.pawapay.io/v1/widget/sessions";

    // =========================
    // UNIQUE DEPOSIT ID
    // =========================
    const depositId = randomUUID();

    // =========================
    // PAYLOAD YO HEREZWA KURI PAWAPAY
    // =========================
    const payload = {
      depositId: depositId,
      amount: amount.toString(), // ex: "5000"
      country: country, // RWA, KEN, UGA, etc
      reason: "Live payment",
      statementDescription: "ONLINE PAYMENT",
      language: "EN",
      returnUrl: "https://newtalentsg.co.rw/payment-result",
    };

    // =========================
    // SEND REQUEST KURI PAWAPAY
    // =========================
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
    // ✅ SUBIZA REDIRECT URL
    // =========================
    return res.status(200).json({
      redirectUrl: data.redirectUrl,
      depositId: depositId,
    });
  } catch (error) {
    console.error("LIVE PAY ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
