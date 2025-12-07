import axios from "axios";

// Numeric-only UUID v4 style, 36 characters
function generateNumericUUID() {
  const digits = "0123456789";
  const s = Array.from({ length: 36 }, (_, i) => {
    if (i === 8 || i === 13 || i === 18 || i === 23) return "-";
    if (i === 14) return "4";
    if (i === 19) return digits[Math.floor(Math.random() * 10)];
    return digits[Math.floor(Math.random() * 10)];
  });
  return s.join("");
}

// Simple phone validation for Rwanda MTN/Airtel
function validatePhone(phone) {
  // Accepts numbers like 078XXXXXXX or +25078XXXXXXX
  const pattern = /^(?:\+250|0)(7[8|2|3|4|5|6|9])\d{7}$/;
  return pattern.test(phone);
}

// Simple amount validation
function validateAmount(amount) {
  const num = Number(amount);
  return !isNaN(num) && num > 0; // could add max limit if needed
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { phone, amount, userId } = req.body;

  if (!phone || !amount || !userId) {
    return res.status(400).json({ message: "Phone, amount and userId are required" });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ message: "Invalid Rwandan phone number format" });
  }

  if (!validateAmount(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const payoutId = generateNumericUUID();

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/payouts",
      {
        payoutId,
        amount: Number(amount),
        currency: "RWF",
        recipient: {
          type: "MMO",
          accountDetails: {
            phoneNumber: phone,
            provider: "MTN-MOMO-RW",
          },
        },
        metadata: { userId },
      },
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
    // Full logging for debugging
    console.error("Axios Error Data:", error.response?.data);
    console.error("Axios Error Status:", error.response?.status);
    console.error("Axios Error Headers:", error.response?.headers);
    console.error("Axios Error Message:", error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data || error.message || "Unknown server error",
    });
  }
}
