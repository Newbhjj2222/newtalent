import axios from "axios";

// =====================
// LIVE TOKEN YAWE
// =====================
const PAWAPAY_TOKEN = 
"eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

// =====================
// RANDOM PAYOUT ID (36 chars)
// =====================
function generateRandomId(length = 36) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// =====================
// VALIDATION HELPERS
// =====================

// Rwanda phone format
function validatePhone(phone) {
  const pattern = /^(?:\+?250|0)(7[2,3,8,9])\d{7}$/;
  return pattern.test(phone);
}

// Amount validation
function validateAmount(amount) {
  const num = Number(amount);
  return !isNaN(num) && Number.isInteger(num) && num >= 100 && num <= 1000000;
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Method not allowed" });

  const { phone, amount, userId } = req.body;

  // =====================
  // PRE–VALIDATION
  // =====================
  const errors = [];
  if (!phone) errors.push("Missing phone");
  if (!amount) errors.push("Missing amount");
  if (!userId) errors.push("Missing userId");

  if (errors.length > 0)
    return res.status(400).json({ success: false, message: errors });

  if (!validatePhone(phone))
    return res.status(400).json({ success: false, message: "Invalid Rwanda phone" });

  if (!validateAmount(amount))
    return res.status(400).json({
      success: false,
      message: "Amount must be integer between 100 – 1,000,000 RWF",
    });

  // =====================
  // FORMAT PHONE INTO MSISDN
  // =====================
  const phoneNumber = phone.startsWith("0")
    ? "250" + phone.slice(1)
    : phone.replace("+", "");

  // =====================
  // FINAL PAYLOAD
  // =====================
  const payoutId = generateRandomId(36);

  const payload = {
    payoutId,
    amount: Number(amount),
    currency: "RWF",
    recipient: {
      type: "MMO",
      accountDetails: {
        phoneNumber,
        provider: "MTN_MOMO_RWA",
      },
    },
    // 🔥 PawaPay requires metadata as OBJECT — NOT ARRAY
    metadata: {
      userId: userId.toString(),
      phone: phoneNumber,
      payoutSource: "NES-APP",
      environment: "LIVE",
    },
  };

  console.log("SENDING PAYOUT PAYLOAD:", payload);

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/payouts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      payoutId,
      data: response.data,
    });
  } catch (error) {
    console.error("PawaPay Error Response:", error.response?.data);
    console.error("Status:", error.response?.status);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.failureReason?.failureMessage ||
        error.response?.data ||
        error.message ||
        "Unknown server error",
    });
  }
}
