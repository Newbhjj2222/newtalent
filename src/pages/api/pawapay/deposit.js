// pages/api/pawapay-deposit.js

import axios from "axios";

// TOKEN yawe ya LIVE (wampaye)
const PAWAPAY_TOKEN =
  "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username, plan, phone, provider } = req.body;

  if (!username)
    return res.status(400).json({ error: "Username required" });

  if (!phone || !/^\d+$/.test(phone))
    return res
      .status(400)
      .json({ error: "Phone must contain digits only (no + or spaces)" });

  if (!provider)
    return res.status(400).json({ error: "Payment provider required" });

  // Amounts depend on plan
  let amount = 0;
  switch (plan) {
    case "onestory":
      amount = 10;
      break;
    case "Daily":
      amount = 150;
      break;
    case "weekly":
      amount = 250;
      break;
    case "monthly":
      amount = 500;
      break;
    case "bestreader":
      amount = 800;
      break;
    default:
      return res.status(400).json({ error: "Invalid plan selected" });
  }

  // Provider metadata
  const providerData = {
    // Rwanda
    AIRTEL_RWA: { currency: "RWF", decimals: 0, country: "RWA" },
    MTN_MOMO_RWA: { currency: "RWF", decimals: 0, country: "RWA" },

    // Zambia
    AIRTEL_OAPI_ZMB: { currency: "ZMW", decimals: 2, country: "ZMB" },
    MTN_MOMO_ZMB: { currency: "ZMW", decimals: 2, country: "ZMB" },
    ZAMTEL_ZMB: { currency: "ZMW", decimals: 2, country: "ZMB" },

    // Mozambique
    VODACOM_MOZ: { currency: "MZN", decimals: 2, country: "MOZ" },

    // Nigeria
    MTN_MOMO_NGA: { currency: "NGN", decimals: 2, country: "NGA" },

    // Congo Brazzaville
    MTN_MOMO_COG: { currency: "XAF", decimals: 0, country: "COG" },

    // Tanzania
    AIRTEL_TZA: { currency: "TZS", decimals: 2, country: "TZA" },
    TIGO_TZA: { currency: "TZS", decimals: 0, country: "TZA" },
    VODACOM_TZA: { currency: "TZS", decimals: 0, country: "TZA" },
    HALOTEL_TZA: { currency: "TZS", decimals: 0, country: "TZA" },
  };

  const p = providerData[provider];
  if (!p)
    return res.status(400).json({ error: "Unsupported payment provider" });

  // Adjust decimals
  if (p.decimals === 0) amount = Math.round(amount);

  // Generate depositId without uuid library
  const depositId = crypto.randomUUID();
  const external_reference = `${username}__${plan}__${Date.now()}`;

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/deposits",
      {
        depositId,
        amount: amount.toString(),
        currency: p.currency,
        country: p.country,
        type: "MOBILE_MONEY", // REQUIRED
        provider: provider, // REQUIRED
        payer: {
          msisdn: phone,
        },
        external_reference,
      },
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
    console.error("PAWAPAY ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      error:
        error.response?.data ||
        error.message ||
        "PawaPay deposit failed",
    });
  }
}
