// pages/api/payout.js

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  // Accept POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { amount, phone } = req.body;

    if (!amount || !phone) {
      return res.status(400).json({
        error: "amount and phone are required",
      });
    }

    // API Token ukoresha
    const PAWAPAY_TOKEN =
      "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

    // Unique payout ID
    const payoutId = uuidv4();

    // Payload ya payout
    const payload = {
      payoutId,
      amount: amount.toString(),
      currency: "RWF",
      recipient: {
        type: "MMO",
        accountDetails: {
          phoneNumber: phone,
          provider: "MTN", // niba ushaka Airtel uhindura
        },
      },
    };

    // Request ya payout
    const response = await axios.post(
      "https://api.sandbox.pawapay.io/v2/payouts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payout requested",
      payoutId: payoutId,
      pawapay: response.data,
    });
  } catch (error) {
    // Saba error yose muri JSON (object object irangira)
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}
