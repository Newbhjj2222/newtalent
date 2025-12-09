// pages/api/pawapay-callback.js

export default async function handler(req, res) {
  // Ensure the request method is POST as pawaPay only sends POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // The request body is automatically parsed by Next.js in the pages router
    const callbackData = req.body;
    console.log('Received pawaPay callback:', callbackData);

    // 2. Extract key data points from the callback body
    const { depositId, status, amount, currency } = callbackData;

    // Optional but highly recommended: Verify the callback signature
    // You would implement a function here to validate the 'Signature'
    // and 'Signature-Input' headers using your pawaPay public key.
    // const isValid = verifyPawapaySignature(req.headers, callbackData);
    // if (!isValid) {
    //   return res.status(403).json({ message: 'Invalid signature' });
    // }

    // 3. Process the transaction status and update your database
    if (status === 'COMPLETED') {
      // Logic to update your order/user balance in your database
      console.log(`✅ Transaction ${depositId} COMPLETED. Amount: ${amount} ${currency}`);
      // e.g., await db.orders.update({ id: depositId }, { status: 'completed' });

    } else if (status === 'FAILED') {
      // Logic to handle failure (e.g., alert admin, log failure reason)
      const { failureReason } = callbackData;
      console.log(`❌ Transaction ${depositId} FAILED. Reason: ${failureReason?.failureCode}`);
      // e.g., await db.orders.update({ id: depositId }, { status: 'failed', failureReason: failureReason?.failureCode });

    } else {
      // Handle other statuses like 'PROCESSING', 'IN_RECONCILIATION', etc.
      console.log(`ℹ️ Transaction ${depositId} status: ${status}`);
    }

    // 4. Return an HTTP 200 OK response to pawaPay
    // This acknowledges receipt and stops pawaPay from retrying the callback
    return res.status(200).json({ message: 'Callback received' });

  } catch (error) {
    console.error('Error handling pawaPay callback:', error);
    // Return an error status if your internal processing fails, 
    // allowing pawaPay to potentially retry.
    return res.status(500).json({ message: 'Internal server error' });
  }
}

