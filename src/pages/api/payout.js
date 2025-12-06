// pages/api/payout.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA"; 

  try {
    const { amount, phone } = req.body;

    // Random payout ID
    const payoutId = "REF" + Math.floor(100000000 + Math.random() * 900000000);

    const payload = {
      payoutId,
      amount: String(amount),
      currency: "RWF",
      recipient: {
        type: "MMO",
        accountDetails: {
          phoneNumber: phone,
          provider: "MTN_MOMO_RWA"   // LIVE format from documentation
        }
      }
    };

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

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
