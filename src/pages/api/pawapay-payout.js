import axios from "axios";

// Numeric-only UUID v4 style, 36 characters
function generateNumericUUID() {
  const digits = "0123456789";
  const s = Array.from({ length: 36 }, (_, i) => {
    if (i === 8 || i === 13 || i === 18 || i === 23) return "-"; // dashes
    if (i === 14) return "4"; // UUID v4 fixed char
    if (i === 19) return digits[Math.floor(Math.random() * 10)]; // variant
    return digits[Math.floor(Math.random() * 10)]; // other random digits
  });
  return s.join("");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { phone, amount, userId } = req.body;
  if (!phone || !amount || !userId) {
    return res.status(400).json({ message: "Phone, amount and userId are required" });
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
        metadata: {
          userId, // save the user ID for reconciliation
        },
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
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
}
