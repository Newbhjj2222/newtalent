import axios from "axios";
import crypto from "crypto";

// ⚠️ NOTE: Mu production si byiza gushyira token muri code
const PAWAPAY_TOKEN =
  "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username, amount, reason } = req.body;

  // ===== Validation =====
  if (!amount) {
    return res.status(400).json({ error: "Missing parameter: amount" });
  }

  if (Number(amount) < 100) {
    return res.status(400).json({ error: "Minimum amount is 100 RWF" });
  }

  const depositId = crypto.randomUUID();

  // ===== pawaPay payload =====
  const bodyToSend = {
    depositId,
    amount: String(amount),
    currency: "RWF",
    country: "RWA",
    reason: reason || "Payment",
    returnUrl: `https://www.newtalentsg.co.rw/payment-success?depositId=${depositId}`,
    metadata: {
      username: username || "guest",
    },
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

    const redirectUrl = response.data?.redirectUrl;

    if (!redirectUrl) {
      return res
        .status(500)
        .json({ error: "PawaPay did not return redirectUrl" });
    }

    // ✅ Payment link
    return res.status(200).json({
      redirectUrl,
      depositId,
    });

  } catch (err) {
    console.error("PawaPay error:", err.response?.data || err.message);
    return res.status(400).json({
      error: err.response?.data || err.message,
    });
  }
}
