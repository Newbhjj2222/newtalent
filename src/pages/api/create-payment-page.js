import axios from "axios";
import crypto from "crypto";

// ====================
// TOKEN ya LIVE yawe
// ====================
const PAWAPAY_TOKEN = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username, nesPoints } = req.body;

  if (!username) return res.status(400).json({ error: "Missing parameter: username" });
  if (!nesPoints) return res.status(400).json({ error: "Missing parameter: nesPoints" });

  const nesPointsMapping = { "10": 10, "50": 50, "100": 100, "200": 200, "500": 500 };
  const amount = nesPointsMapping[nesPoints];
  if (!amount) return res.status(400).json({ error: "Invalid nesPoints value" });

  const depositId = crypto.randomUUID();

  const bodyToSend = {
    depositId,
    amount: amount.toString(),
    currency: "RWF",          // Rwanda currency
    type: "MOBILE_MONEY",     // Required
    reason: `Purchase of ${nesPoints} NES Points`,
    returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-result?depositId=${depositId}`,
    metadata: [{ username }, { nesPoints }],
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

    const redirectUrl = response.data.redirectUrl;
    if (!redirectUrl) {
      return res.status(500).json({ error: "Payment page URL not returned by PawaPay" });
    }

    return res.status(200).json({ redirectUrl });

  } catch (err) {
    console.error("PawaPay Payment Page error:", err.response?.data || err.message);
    return res.status(400).json({ error: err.response?.data || err.message });
  }
}
