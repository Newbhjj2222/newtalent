import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const providerData = {
  MTN_MOMO_RWA: { country: "RWA", currency: "RWF", decimals: 0, phoneRegex: /^07\d{8}$/ },
  AIRTEL_RWA: { country: "RWA", currency: "RWF", decimals: 0, phoneRegex: /^07\d{8}$/ },
  MTN_MOMO_NGA: { country: "NGA", currency: "NGN", decimals: 2, phoneRegex: /^0\d{9}$/ },
  AIRTEL_NGA: { country: "NGA", currency: "NGN", decimals: 0, phoneRegex: /^0\d{9}$/ },
  VODACOM_MOZ: { country: "MOZ", currency: "MZN", decimals: 2, phoneRegex: /^26\d{8}$/ },
  AIRTEL_TZA: { country: "TZA", currency: "TZS", decimals: 2, phoneRegex: /^0\d{9}$/ },
  MTN_MOMO_ZMB: { country: "ZMB", currency: "ZMW", decimals: 2, phoneRegex: /^26\d{9}$/ },
  AIRTEL_OAPI_ZMB: { country: "ZMB", currency: "ZMW", decimals: 2, phoneRegex: /^26\d{9}$/ },
  ZAMTEL_ZMB: { country: "ZMB", currency: "ZMW", decimals: 2, phoneRegex: /^26\d{9}$/ },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username, plan, phone, provider } = req.body;

  // Provider validation
  if (!provider || !providerData[provider])
    return res.status(400).json({ error: "Valid provider is required" });

  const info = providerData[provider];

  // Phone validation
  if (!phone || !info.phoneRegex.test(phone))
    return res.status(400).json({ error: `Invalid phone number for provider ${provider}` });

  // Amount based on plan
  let amount = 0;
  switch (plan) {
    case "onestory": amount = 10; break;
    case "Daily": amount = 150; break;
    case "weekly": amount = 250; break;
    case "monthly": amount = 500; break;
    case "bestreader": amount = 800; break;
    default: return res.status(400).json({ error: "Invalid plan selected" });
  }

  // Round amount if decimals = 0
  if (info.decimals === 0) amount = Math.round(amount);

  const external_reference = uuidv4(); // unique ID for this payment
  const PAWAPAY_TOKEN = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/deposits",
      {
        amount: amount.toString(), // must be string
        currency: info.currency,
        payer: { msisdn: phone },   // phone number only, digits
        type: "MOBILE_MONEY",
        provider,
        external_reference
      },
      { headers: { Authorization: `Bearer ${PAWAPAY_TOKEN}`, "Content-Type": "application/json" } }
    );

    if (response.data?.error) return res.status(400).json({ error: response.data.error });

    res.status(200).json({ message: "Payment initiated successfully!", data: response.data });

  } catch (err) {
    console.error("PawaPay API error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.message || JSON.stringify(err.response?.data) || err.message || "Failed to process payment"
    });
  }
}
