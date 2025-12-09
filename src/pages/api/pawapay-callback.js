export const config = {
  api: {
    bodyParser: false, // IMPORTANT: allow raw body for signature verification
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1. Read raw body
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString("utf8");
    console.log("RAW CALLBACK:", rawBody);

    // 2. Parse JSON manually
    let callbackData = {};
    try {
      callbackData = JSON.parse(rawBody);
    } catch (e) {
      console.error("❌ Failed to parse JSON:", e);
      return res.status(400).json({ error: "Invalid JSON" });
    }

    console.log("PARSED DATA:", callbackData);

    // Extract fields
    const transactionId = callbackData.transactionId;
    const status = callbackData.status;
    const amount = callbackData.amount?.value;
    const currency = callbackData.amount?.currency;

    if (!transactionId) {
      return res.status(400).json({ error: "Missing transactionId" });
    }

    // 3. Process statuses
    if (status === "COMPLETED") {
      console.log(`✅ ${transactionId} COMPLETED: ${amount} ${currency}`);
    } else if (status === "FAILED") {
      console.log("❌ FAILED:", callbackData.failureReason);
    } else {
      console.log(`ℹ️ STATUS: ${status}`);
    }

    // 4. MUST return 200 for pawaPay
    return res.status(200).json({ message: "Callback received" });

  } catch (err) {
    console.error("🔥 INTERNAL SERVER ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
