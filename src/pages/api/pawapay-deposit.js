import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username, plan, phone } = req.body;

  // Validate phone
  if (!phone || !phone.match(/^07\d{8}$/)) {
    return res.status(400).json({ error: "Invalid Rwandan phone number" });
  }

  // Map plan → amount
  let amount = 0;
  switch (plan) {
    case "onestory": amount = 10; break;
    case "Daily": amount = 150; break;
    case "weekly": amount = 250; break;
    case "monthly": amount = 500; break;
    case "bestreader": amount = 800; break;
    default:
      return res.status(400).json({ error: "Invalid plan selected" });
  }

  const external_reference = `${username}__${plan}__${amount}`;

  // Live PawaPay API token
  const PAWAPAY_TOKEN = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

  try {
    console.log("Sending request to PawaPay:", { amount, phone, external_reference, type: "MOBILE_MONEY" });

    const response = await axios.post(
      "https://api.pawapay.io/v2/deposits",
      {
        amount,
        payer: { msisdn: phone },
        type: "MOBILE_MONEY",   // <--- Required parameter added
        external_reference,
      },
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("PawaPay response:", response.data);

    if (response.data?.error) {
      return res.status(400).json({ error: response.data.error });
    }

    res.status(200).json({ message: "Payment initiated successfully!", data: response.data });

  } catch (err) {
    console.error("PawaPay API error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.message || err.response?.data || err.message || "Failed to process payment with PawaPay"
    });
  }
}
