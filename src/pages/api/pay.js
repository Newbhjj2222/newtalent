import axios from "axios";
import crypto from "crypto";

const PAWAPAY_TOKEN =
  "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

  const { username, nesPoints, amount } = req.body;

  if (!username) return res.status(400).json({ error: "Missing parameter: username" });
  if (!nesPoints) return res.status(400).json({ error: "Missing parameter: nesPoints" });
  if (!amount) return res.status(400).json({ error: "Missing parameter: amount" });

  const depositId = crypto.randomUUID();

  const bodyToSend = {
    depositId,
    reason: `Payment for ${nesPoints} NES Points — Amount: ${amount} RWF`,
    returnUrl: `https://www.newtalentsg.co.rw/api/pawapay-callback?depositId=${depositId}`,
    metadata: [
      { username },
      { nesPoints },
      { amount }
    ]
  };

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/paymentpage",
      bodyToSend,
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const redirectUrl = response.data.redirectUrl;
    if (!redirectUrl)
      return res.status(500).json({ error: "PawaPay did not return redirectUrl" });

    res.status(200).json({ redirectUrl });

  } catch (err) {
    console.error("PawaPay error:", err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
}
