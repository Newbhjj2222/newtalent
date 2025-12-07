// pages/api/payout.js
import axios from "axios";

// Generate 36-length random ID
function generateRandomId36() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 36; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { phone, amount } = req.body;

    // Validate fields before sending request
    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: phone or amount",
      });
    }

    // VALID metadata array — no duplicates
    const metadata = [
      { fieldName: "customerPhone", fieldValue: phone },
      { fieldName: "transactionAmount", fieldValue: String(amount) },
      { fieldName: "description", fieldValue: "Payout request" },
    ];

    const payoutId = generateRandomId36();

    const payload = {
      payoutId: payoutId,
      merchantId: "newtalentsg-live-merchant", // Niba ufite merchantId yawe shyiramo hano
      currency: "RWF",
      country: "RW",
      amount: Number(amount),
      payoutMode: "MOBILE_MONEY",
      product: "MTN-MOMO-RW",
      phoneNumber: phone,
      metadata: metadata,
    };

    // SEND REQUEST
    const response = await axios.post(
      "https://api.pawapay.cloud/payouts",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer LIVE_API_KEY_HANO", // API KEY yawe hano nka string
        },
      }
    );

    return res.status(200).json({
      success: true,
      sent: true,
      payoutId,
      response: response.data,
    });
  } catch (error) {
    console.log("API ERROR:", error?.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: error?.response?.data || error.message,
    });
  }
}
