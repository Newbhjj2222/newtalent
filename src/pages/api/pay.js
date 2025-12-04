// pages/api/pay.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phone, amount, telco, username, plan } = req.body;

    // --------------------------------------------
    // POWERPAY API KEY YAWE — WANSABYE KUYISHYIRAMO
    // --------------------------------------------
    const POWERPAY_API_KEY = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzc4ODA0LCJpYXQiOjE3NjQ4NDYwMDQsInBtIjoiREFGLFBBRiIsImp0aSI6IjBmZmI2MDUyLWMwYzctNDM5Yi1iZGVhLTc5NDA1OTgzMTNjZCJ9.RQdMQ1_A00iFviYwzazrHUy_jHk9UmG3cedKZpJ5NwElKiBPr-TTp0WkHKzluDsU5xBBLPgocFwBrcHROZjOYg";

    const POWERPAY_BASE_URL = "https://api.powerpay.rw/api";
    const CALLBACK_URL = "https://yourdomain.com/api/callback";
    // --------------------------------------------

    const response = await fetch(`${POWERPAY_BASE_URL}/merchant/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${POWERPAY_API_KEY}`,
      },
      body: JSON.stringify({
        amount,
        telco,
        phone_number: phone,
        external_reference: `${username}__${plan}__${amount}`,
        callback_url: CALLBACK_URL,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
