// pages/api/pawapay/deposit.js

import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { phone, provider, amount } = req.body;

  if (!phone) return res.status(400).json({ error: "Phone required" });
  if (!provider) return res.status(400).json({ error: "Provider required" });
  if (!amount) return res.status(400).json({ error: "Amount required" });

  // TOKEN YAWE DIRECT
  const API_TOKEN = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

  const depositId = crypto.randomUUID();

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/deposits",
      {
        depositId,
        amount: String(amount),
        currency: "RWF",     // ushobora kubihindura
        operationType: "DEPOSIT",
        payer: {
          msisdn: phone,
          type: "MSISDN",
        },
        provider: provider,
        returnUrl: "https://yourdomain.com/payment-success",
        callbackUrl: "https://yourdomain.com/api/pawapay/callback"
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({
      message: "Deposit created",
      data: response.data
    });

  } catch (err) {
    console.log("PAWAPAY ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      error: err.response?.data || err.message
    });
  }
}
