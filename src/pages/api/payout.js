export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const token = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

  const { amount, phone } = req.body;

  if (!amount || !phone) {
    return res.status(400).json({ success: false, error: "Missing amount or phone" });
  }

  // RANDOM ID GENERATOR
  function randomId(length) {
    let out = "";
    const chars = "0123456789";
    for (let i = 0; i < length; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  const payoutId = randomId(10);
  const clientRef = "REF" + randomId(8);

  try {
    const response = await fetch("https://api.pawapay.io/v2/payouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payoutId: payoutId,
        amount: {
          currency: "RWF",
          value: Number(amount)
        },
        paymentMethod: {
          type: "MOBILE_MONEY",
          provider: "MTN",
          phoneNumber: phone
        },
        customerTimestamp: new Date().toISOString(),
        clientReference: clientRef,
      }),
    });

    const result = await response.json();

    return res.status(response.status).json({
      success: response.ok,
      payoutId,
      clientRef,
      response: result
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error", details: error.message });
  }
}
