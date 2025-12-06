// pages/api/payout.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA"; 

  const { phone, amount } = await req.body;

  // Generate random 36-character payoutId
  const generatePayoutId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 36; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const payoutId = generatePayoutId();

  // Determine provider by phone prefix
  let provider = "MTN_MOMO_RWA";
  const num = phone.replace("+", "").replace("250", "");
  if (num.startsWith("78") || num.startsWith("79")) {
    provider = "AIRTEL_MONEY_RWA";
  }

  const payload = {
    payoutId,
    amount: String(amount),
    currency: "RWF",
    recipient: {
      type: "MMO",
      accountDetails: {
        phoneNumber: phone,
        provider
      }
    }
  };

  try {
    const response = await fetch("https://api.pawapay.io/v2/payouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
