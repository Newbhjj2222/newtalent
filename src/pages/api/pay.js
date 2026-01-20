import axios from "axios";
import crypto from "crypto";

// LIVE TOKEN yawe
const PAWAPAY_TOKEN =
  "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }

  const { username, reason } = req.body;

  if (!username) {
    return res.status(400).json({
      error: { message: "Missing parameter: username" },
    });
  }

  const depositId = crypto.randomUUID();

  const bodyToSend = {
    depositId,
    returnUrl: `https://www.newtalentsg.co.rw/payment-success?depositId=${depositId}`,
    country: "RWA",             // Rwanda
    reason: reason || "Payment",
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

    return res.status(200).json({
      redirectUrl: response.data.redirectUrl,
      depositId,
    });

  } catch (err) {
    return res.status(err.response?.status || 400).json({
      error: err.response?.data || { message: err.message },
    });
  }
}
