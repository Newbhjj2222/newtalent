import axios from "axios";
import crypto from "crypto";

// ⚡ LIVE Token yawe
const PAWAPAY_TOKEN = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

// 🔹 In-memory deposits log (replace na DB)
const deposits = {};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { username, amount, reason, country } = req.body;

  if (!username || !amount || !country) {
    return res.status(400).json({ error: "Missing username, amount or country" });
  }

  const depositId = crypto.randomUUID();

  // Log deposit locally
  deposits[depositId] = { username, amount, reason, country, status: "PENDING", createdAt: new Date() };

  const body = {
    depositId,
    reason: reason || "Payment",
    returnUrl: `https://www.newtalentsg.co.rw/payment-callback?depositId=${depositId}`,
    amount: String(amount),
    country,
    metadata: { username },
  };

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/paymentpage",
      body,
      { headers: { Authorization: `Bearer ${PAWAPAY_TOKEN}`, "Content-Type": "application/json" } }
    );

    if (!response.data?.redirectUrl) {
      return res.status(500).json({ error: "pawaPay did not return redirectUrl", raw: response.data });
    }

    res.status(200).json({ redirectUrl: response.data.redirectUrl, depositId });

  } catch (err) {
    console.error("PawaPay error:", err.response?.data || err.message);
    res.status(err.response?.status || 400).json({ error: err.response?.data || { message: err.message } });
  }
}
