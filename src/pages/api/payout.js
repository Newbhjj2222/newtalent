// pages/api/payout.js
import axios from "axios";

const PAWAPAY_API_KEY = 
  "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    payoutId,
    amount,
    currency,
    phoneNumber,
    country,
    payoutMethod,
    metadata
  } = req.body;

  // REQUIRED VALIDATION
  const required = { payoutId, amount, currency, phoneNumber, country, payoutMethod };
  for (const key in required) {
    if (!required[key]) {
      return res.status(400).json({ error: `Missing field: ${key}` });
    }
  }

  // Clean metadata (remove duplicates)
  let cleanMetadata = [];
  if (Array.isArray(metadata)) {
    const used = new Set();
    metadata.forEach(m => {
      if (m.fieldName && m.value && !used.has(m.fieldName)) {
        cleanMetadata.push({
          fieldName: m.fieldName,
          value: m.value
        });
        used.add(m.fieldName);
      }
    });
  }

  try {
    const response = await axios.post(
      "https://api.pawapay.cloud/payouts",
      {
        payoutId,
        payoutMethod: {
          type: payoutMethod,
          phoneNumber,
          country,
          currency,
          amount
        },
        metadata: cleanMetadata
      },
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.response?.data || e.message
    });
  }
}
