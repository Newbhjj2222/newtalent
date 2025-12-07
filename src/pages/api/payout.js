export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

  const { phone, amount } = req.body;

  // 🔵 CLEAN PHONE FOR PAWAPAY FORMAT
  let cleanPhone = phone
    .replace(/\+/g, "")   // remove "+"
    .replace(/ /g, "")    // remove spaces
    .trim();

  // Remove 250 if present
  if (cleanPhone.startsWith("250")) {
    cleanPhone = cleanPhone.slice(3);
  }

  // Remove leading zero
  if (cleanPhone.startsWith("0")) {
    cleanPhone = cleanPhone.slice(1);
  }

  // Validate phone must be digits only
  if (!/^\d{9}$/.test(cleanPhone)) {
    return res.status(400).json({
      error: "Phone must be 9 digits — no +, no 250, no 0, no spaces."
    });
  }

  // 🔵 Detect provider
  let provider = "MTN_MOMO_RWA";
  if (cleanPhone.startsWith("78") || cleanPhone.startsWith("79")) {
    provider = "AIRTEL_MONEY_RWA";
  }

  // 🔵 Generate correct UUIDv4
  function generateUUIDv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const payoutId = generateUUIDv4();

  // 🔵 PAYLOAD
  const payload = {
    payoutId,
    amount: String(amount),
    currency: "RWF",
    recipient: {
      type: "MMO",
      accountDetails: {
        phoneNumber: cleanPhone, // ← MUST BE CLEANED!
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

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
