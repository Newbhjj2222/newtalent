import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, plan, phone } = req.body;

  // Define amount based on plan
  let amount = 0;
  switch (plan) {
    case "onestory": amount = 10; break;
    case "Daily": amount = 150; break;
    case "weekly": amount = 250; break;
    case "monthly": amount = 500; break;
    case "bestreader": amount = 800; break;
    default: amount = 0;
  }

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/deposits",
      {
        amount,
        payer: { msisdn: phone },
        external_reference: `${username}__${plan}__${amount}`,
        // correspondent optional depending on PawaPay account setup
      },
      {
        headers: {
          Authorization: `Bearer eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("PawaPay API error:", err.response ? err.response.data : err.message);
    res.status(500).json({ error: "Failed to process payment with PawaPay" });
  }
}
