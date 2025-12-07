import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const callbackData = req.body;

    // Log the callback data for debugging
    console.log("Received callback data:", JSON.stringify(callbackData, null, 2));

    // Process the callback based on the PawaPay specifications
    // Example: Check for success or failure
    if (callbackData.status === "SUCCESS") {
      // Handle successful payout
      console.log(`Payout successful for payoutId: ${callbackData.payoutId}`);
      // You could update your database or notify the user here
    } else if (callbackData.status === "FAILED") {
      // Handle failed payout
      console.log(`Payout failed for payoutId: ${callbackData.payoutId}`);
      // You could log the error or notify the user here
    } else {
      console.log(`Unknown status for payoutId: ${callbackData.payoutId}`);
    }

    // Respond to PawaPay to acknowledge receipt of the callback
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing callback:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
