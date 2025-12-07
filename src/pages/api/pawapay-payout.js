import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Validate Rwanda phone numbers
function validatePhone(phone) {
  const pattern = /^(?:\+?250|0)(7[8|2|3|4|5|6|9])\d{7}$/;
  return pattern.test(phone);
}

// Validate amount
function validateAmount(amount) {
  const num = Number(amount);
  return !isNaN(num) && Number.isInteger(num) && num >= 100 && num <= 1000000;
}

// Validate metadata array
function validateMetadataArray(metadata) {
  return Array.isArray(metadata) && metadata.length > 0;
}

// Function to check for duplicate metadata
function hasDuplicateMetadata(metadata, key) {
  return metadata.some(item => item.key === key);
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Method not allowed" });

  const { phone, amount, userId } = req.body;

  // Pre-send validation
  const errors = [];
  if (!phone) errors.push("Missing phone parameter");
  if (!amount) errors.push("Missing amount parameter");
  if (!userId) errors.push("Missing userId parameter");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ success: false, message: "Invalid Rwanda phone number" });
  }

  if (!validateAmount(amount)) {
    return res.status(400).json({
      success: false,
      message: "Amount must be integer within 100–1,000,000 RWF",
    });
  }

  // Metadata as array with duplication check
  const metadata = [];
  if (!hasDuplicateMetadata(metadata, "userId")) {
    metadata.push({ key: "userId", value: userId.toString() });
  }
  if (!hasDuplicateMetadata(metadata, "source")) {
    metadata.push({ key: "source", value: "Next.js app" });
  }

  if (!validateMetadataArray(metadata)) {
    return res.status(400).json({ success: false, message: "Metadata array is required" });
  }

  const payoutId = uuidv4();

  // Convert phone to international MSISDN
  const phoneNumber = phone.startsWith("0") ? "250" + phone.slice(1) : phone.replace(/\+/, "");

  // Payload ready to send
  const payload = {
    payoutId,
    amount: Number(amount),
    currency: "RWF",
    recipient: {
      type: "MMO",
      accountDetails: {
        phoneNumber,
        provider: "MTN_MOMO_RWA",
      },
    },
    metadata, // array
  };

  console.log("Prepared payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(
      "https://api.pawapay.io/v2/payouts",
      payload,
      {
        headers: {
          Authorization: `Bearer eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      payoutId,
      data: response.data,
    });
  } catch (error) {
    console.error("PawaPay Error Data:", error.response?.data);
    console.error("Status:", error.response?.status);
    console.error("Message:", error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data || error.message || "Unknown server error",
    });
  }
}
