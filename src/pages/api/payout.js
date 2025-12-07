// /pages/api/payout.js

// Generate UUID v4 without any library
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// LIVE API TOKEN
const API_KEY =
  'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: true,
      message: "Method not allowed. Use POST."
    });
  }

  try {
    let { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        error: true,
        message: "Phone and amount are required."
      });
    }

    // Clean & validate phone
    phone = phone.replace(/\D/g, ""); // only digits
    if (phone.startsWith("0")) phone = phone.substring(1);
    if (phone.startsWith("250")) phone = phone.substring(3);

    if (phone.length !== 9) {
      return res.status(400).json({
        error: true,
        message: "Phone must be 9 digits (after cleaning)."
      });
    }

    const payoutId = generateUUID();

    const payload = {
      payoutId: payoutId,
      payee: {
        msisdn: phone,
        provider: "MTN-MOMO-RW"
      },
      amount: {
        currency: "RWF",
        value: Number(amount)
      },
      statementDescription: "Withdrawal"
    };

    const pawapayRes = await fetch("https://api.pawapay.io/v2/payouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY
      },
      body: JSON.stringify(payload)
    });

    const raw = await pawapayRes.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      data = raw; // fallback if not JSON
    }

    return res.status(pawapayRes.status).json({
      error: pawapayRes.status !== 200,
      status: pawapayRes.status,
      payoutId,
      response: data
    });

  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      details: err.message
    });
  }
}
