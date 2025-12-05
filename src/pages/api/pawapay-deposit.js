import axios from "axios";
import crypto from "crypto";

// ====================
// TOKEN ya LIVE yawe
// ====================
const PAWAPAY_TOKEN = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

// ====================
// Mapping ya NES points ku mafaranga
// ====================
const nesPointsMapping = {
  "10": 10,
  "50": 50,
  "100": 100,
  "200": 200,
  "500": 500,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username, phone, provider, nesPoints } = req.body;

  // ====================
  // Validate fields
  // ====================
  if (!username) return res.status(400).json({ error: "Missing parameter: username" });
  if (!phone) return res.status(400).json({ error: "Missing parameter: phone" });
  if (!provider) return res.status(400).json({ error: "Missing parameter: provider" });
  if (!nesPoints || !nesPointsMapping[nesPoints]) return res.status(400).json({ error: "Missing or invalid parameter: nesPoints" });

  if (!/^\d+$/.test(phone)) {
    return res.status(400).json({ error: "Phone must contain digits only (no + or spaces)" });
  }

  // ====================
  // Amount based on NES points
  // ====================
  let amount = nesPointsMapping[nesPoints];

  // ====================
  // Supported providers (Rwanda example)
  // ====================
  const providerData = {
    AIRTEL_RWA: { currency: "RWF", decimals: 0, country: "RWA" },
    MTN_MOMO_RWA: { currency: "RWF", decimals: 0, country: "RWA" },
  };

  const p = providerData[provider];
  if (!p) return res.status(400).json({ error: `Unsupported payment provider: ${provider}` });

  if (p.decimals === 0) amount = Math.round(amount);
  else amount = amount.toFixed(2);

  const depositId = crypto.randomUUID();
  const external_reference = `${username}__NES${nesPoints}__${Date.now()}`;

  const bodyToSend = {
    depositId,
    amount: amount.toString(),
    currency: p.currency,
    country: p.country,
    type: "MOBILE_MONEY",
    provider,
    payer: { msisdn: phone },
    external_reference,
  };

  console.log("Sending body to PawaPay:", bodyToSend);

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/deposits",
      bodyToSend,
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      message: "Payment initiated successfully",
      result: response.data,
    });
  } catch (error) {
    const failureMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message;

    console.error("PAWAPAY ERROR:", failureMessage);

    return res.status(400).json({
      error: `PawaPay deposit failed: ${failureMessage}`,
    });
  }
}
