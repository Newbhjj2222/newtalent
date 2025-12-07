// pages/api/payout.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, amount, currency, provider, externalId } = req.body;

  // 🔥 API TOKEN YAWE NYAYO
  const apiToken =
    "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

  try {
    const response = await fetch("https://api.pawapay.cloud/payouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${apiToken}`
      },
      body: JSON.stringify({
        payoutId: externalId,
        amount: { amount: Number(amount), currency },
        customer: {
          customerId: externalId,
          email: "user@example.com"
        },
        paymentMethod: {
          type: "MMO",
          provider,
          accountNumber: phone
        }
      })
    });

    const raw = await response.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { raw };
    }

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error });
  }
}
