import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    const {
      amount,
      phoneNumber,
      currency,
      country,
      userId
    } = req.body;

    // VALIDATION OF REQUIRED FIELDS
    const requiredFields = { amount, phoneNumber, currency, country, userId };
    for (const key in requiredFields) {
      if (!requiredFields[key]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${key}`,
        });
      }
    }

    // Convert to full MSISDN format
    const msisdn =
      phoneNumber.startsWith("0")
        ? `250${phoneNumber.slice(1)}`
        : phoneNumber.replace("+", "");

    const payoutId = uuidv4();

    // CLEAN METADATA (avoid duplicates)
    let metadata = [];
    const used = new Set();

    metadata.push({ fieldName: "userId", value: userId.toString() });

    metadata = metadata.filter((m) => {
      if (!used.has(m.fieldName)) {
        used.add(m.fieldName);
        return true;
      }
      return false;
    });

    // PAWAPAY PAYOUT PAYLOAD
    const payload = {
      payoutId,
      payoutMethod: {
        type: "MMO",
        phoneNumber: msisdn,
        amount: Number(amount),
        currency,
        country,
      },
      metadata,
    };

    // SEND REQUEST
    const response = await axios.post(
      "https://api.pawapay.cloud/payouts",
      payload,
      {
        headers: {
          Authorization:
            "Bearer eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA",
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      payoutId,
      data: response.data,
    });
  } catch (error) {
    console.error("PawaPay ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}
