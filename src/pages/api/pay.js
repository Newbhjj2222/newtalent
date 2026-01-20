import axios from "axios";
import crypto from "crypto";

// ⚠️ LIVE TOKEN yawe ya PawaPay
const PAWAPAY_TOKEN =
  "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }

  const { username, amount, reason, country } = req.body;

  if (!username || !amount || !country) {
    return res.status(400).json({
      error: { message: "Missing parameter: username, amount or country" },
    });
  }

  // Deposit ID unique
  const depositId = crypto.randomUUID();

  // ===== BODY YA PAYMENT PAGE =====
  const bodyToSend = {
    depositId,
    returnUrl: `https://www.newtalentsg.co.rw/payment-success?depositId=${depositId}`,
    reason: reason || "Payment",
    amount: String(amount), // MUST BE STRING
    country,               // ISO 3166-1 alpha-3, ex: "RWA"
    metadata: { username },
  };

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/paymentpage",
      bodyToSend,
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data?.redirectUrl) {
      return res.status(500).json({
        error: {
          message: "pawaPay did not return redirectUrl",
          raw: response.data,
        },
      });
    }

    // Success: return payment link
    return res.status(200).json({
      redirectUrl: response.data.redirectUrl,
      depositId,
    });

  } catch (err) {
    console.error("Full pawaPay error:", err.response?.data || err.message);
    return res.status(err.response?.status || 400).json({
      error: err.response?.data || { message: err.message },
    });
  }
}
