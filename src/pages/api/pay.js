import axios from "axios";
import crypto from "crypto";

// ⚠️ LIVE PAWAPAY TOKEN (nk'uko wabishatse)
const PAWAPAY_TOKEN =
  "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: {
        message: "Method Not Allowed",
      },
    });
  }

  const { amount, reason } = req.body;

  // ===== VALIDATION =====
  if (!amount) {
    return res.status(400).json({
      error: {
        message: "Missing parameter: amount",
      },
    });
  }

  const depositId = crypto.randomUUID();

  // ===== BODY ISHYIRWA UKO PAWAPAY DOCS ZIBIVUGA (LIVE) =====
  const bodyToSend = {
    depositId,
    returnUrl: `https://www.newtalentsg.co.rw/payment-success?depositId=${depositId}`,
    amount: String(amount),   // ⚠️ IGOMBA KUBA STRING
    country: "RWA",           // Rwanda
    reason: reason || "Payment",
  };

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/paymentpage", // ✅ LIVE ENDPOINT
      bodyToSend,
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ===== SUCCESS =====
    if (!response.data?.redirectUrl) {
      return res.status(500).json({
        error: {
          message: "pawaPay did not return redirectUrl",
          raw: response.data,
        },
      });
    }

    return res.status(200).json({
      redirectUrl: response.data.redirectUrl,
      depositId,
    });

  } catch (err) {
    // ===== ERROR NYAYO YA PAWAPAY (RAW) =====
    return res.status(err.response?.status || 400).json({
      error: err.response?.data || {
        message: err.message,
      },
    });
  }
}
