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

  const { username, plan, phone, provider } = req.body;

  // ====================
  // Validation y'amas fields
  // ====================
  if (!username) return res.status(400).json({ error: "Missing parameter: username" });
  if (!phone) return res.status(400).json({ error: "Missing parameter: phone" });
  if (!provider) return res.status(400).json({ error: "Missing parameter: provider" });
  if (!plan) return res.status(400).json({ error: "Missing parameter: plan" });

  if (!/^\d+$/.test(phone)) {
    return res.status(400).json({ error: "Phone must contain digits only (no + or spaces)" });
  }

  // ====================
  // Amount based on plan
  // ====================
  let amount = 0;
  switch (plan) {
    case "onestory": amount = 10; break;
    case "Daily": amount = 150; break;
    case "weekly": amount = 250; break;
    case "monthly": amount = 500; break;
    case "bestreader": amount = 800; break;
    default: return res.status(400).json({ error: "Invalid plan selected" });
  }

  // ====================
  // Supported providers
  // ====================
  const providerData = {
    AIRTEL_RWA: { currency: "RWF", decimals: 0, country: "RWA" },
    MTN_MOMO_RWA: { currency: "RWF", decimals: 0, country: "RWA" },
    AIRTEL_OAPI_ZMB: { currency: "ZMW", decimals: 2, country: "ZMB" },
    MTN_MOMO_ZMB: { currency: "ZMW", decimals: 2, country: "ZMB" },
    ZAMTEL_ZMB: { currency: "ZMW", decimals: 2, country: "ZMB" },
    VODACOM_MOZ: { currency: "MZN", decimals: 2, country: "MOZ" },
    MTN_MOMO_NGA: { currency: "NGN", decimals: 2, country: "NGA" },
    MTN_MOMO_COG: { currency: "XAF", decimals: 0, country: "COG" },
    AIRTEL_TZA: { currency: "TZS", decimals: 2, country: "TZA" },
    TIGO_TZA: { currency: "TZS", decimals: 0, country: "TZA" },
    VODACOM_TZA: { currency: "TZS", decimals: 0, country: "TZA" },
    HALOTEL_TZA: { currency: "TZS", decimals: 0, country: "TZA" },
  };

  const p = providerData[provider];
  if (!p) return res.status(400).json({ error: `Unsupported payment provider: ${provider}` });

  if (p.decimals === 0) amount = Math.round(amount);

  const depositId = crypto.randomUUID();
  const external_reference = `${username}__${plan}__${Date.now()}`;

  const bodyToSend = {
    depositId,
    amount: amount.toString(),
    currency: p.currency,
    country: p.country,
    type: "MOBILE_MONEY", // ✅ mandatory
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

    return res.status(500).json({
      error: `PawaPay deposit failed: ${failureMessage}`,
    });
  }
}
