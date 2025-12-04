// pages/api/pawapay/callback.js

export default async function handler(req, res) {
  console.log("CALLBACK RECEIVED:", req.body);

  // PAWAPAY ituma POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Menya status yishyuwe
  const { depositId, status, failureReason } = req.body;

  // Ushobora kubika status muri database hano

  return res.status(200).json({ received: true });
}
