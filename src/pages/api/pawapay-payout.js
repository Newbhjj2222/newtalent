import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // real UUID v4

// Simple phone validation for Rwanda MTN/Airtel
function validatePhone(phone) {
  // Accept numbers like "25078XXXXXXX" (international MSISDN) or "078XXXXXXX"
  const pattern = /^(?:\+?250|0)(7[8|2|3|4|5|6|9])\d{7}$/;
  return pattern.test(phone);
}

// Amount validation (example: 100–1,000,000 RWF)
function validateAmount(amount) {
  const num = Number(amount);
  return !isNaN(num) && Number.isInteger(num) && num >= 100 && num <= 1000000;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { phone, amount, userId } = req.body;

  if (!phone || !amount || !userId) {
    return res.status(400).json({ message: "Phone, amount, and userId are required" });
  }

  if (!validatePhone(phone)) return res.status(400).json({ message: "Invalid Rwanda phone number" });
  if (!validateAmount(amount)) return res.status(400).json({ message: "Amount must be integer within 100–1,000,000 RWF" });

  const payoutId = uuidv4(); // real UUID v4

  // Convert phone to international format if needed
  let phoneNumber = phone.startsWith("0") ? "250" + phone.slice(1) : phone.replace(/\+/, "");

  const payload = {
    payoutId,
    amount: Number(amount),
    currency: "RWF",
    recipient: {
      type: "MMO",
      accountDetails: {
        phoneNumber,
        provider: "MTN_MOMO_RWA", // exactly as PawaPay docs
      },
    },
    metadata: { userId },
  };

  console.log("Payload being sent:", payload);

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/payouts",
      payload,
      {
        headers: {
          Authorization: `Bearer eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      payoutId,
      data: response.data,
    });
  } catch (error) {
    console.error("PawaPay Error Data:", error.response?.data);
    console.error("Status:", error.response?.status);
    console.error("Message:", error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data || error.message || "Unknown server error",
    });
  }
}
