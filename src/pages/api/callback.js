export default async function handler(req, res) {
  console.log("CALLBACK request received:", req.method);

  // ACCEPT ALL METHODS — PowerPay ihora ikoresha POST
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Callback received (non-POST allowed)" });
  }

  try {
    const body = req.body;
    console.log("CALLBACK BODY:", body);

    // SUCCESS CASE
    if (body?.status === "SUCCESS") {
      // Aha niho wongeramo update yo muri database
      return res.status(200).json({ message: "Payment success processed" });
    }

    // FAILED CASE
    return res.status(200).json({ message: "Payment callback received" });
  } catch (error) {
    console.error("Callback error:", error);
    return res.status(500).json({ error: "Callback processing failed" });
  }
}
