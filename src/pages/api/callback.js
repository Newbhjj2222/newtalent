export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body;

    console.log("POWERPAY CALLBACK:", body);

    // Check if payment succeeded
    if (body?.status !== "SUCCESS") {
      return res.status(200).json({ received: true });
    }

    // Example: You can update Firestore or your DB here
    // Example fields PowerPay sends:
    // phone, amount, transactionId

    // TODO: Update your DB according to the username or phone
    // Example:
    // await updateUserBalance(body.phone, body.amount);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Callback error:", error);
    return res.status(500).json({ error: "Callback processing failed" });
  }
}
