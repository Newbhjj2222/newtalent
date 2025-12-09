// app/api/pawapay-callback/route.js

import { NextResponse } from 'next/server';

// Ensure your endpoint can receive a POST request
export async function POST(request) {
  try {
    // 1. Parse the incoming JSON body from pawaPay
    const callbackData = await request.json();
    console.log('Received pawaPay callback:', callbackData);

    // 2. Extract key data points from the callback body
    const { depositId, status, amount, currency } = callbackData;

    // Optional but highly recommended: Verify the callback signature
    // You would implement a function here to validate the 'Signature'
    // and 'Signature-Input' headers using your pawaPay public key.
    // const isValid = verifyPawapaySignature(request.headers, callbackData);
    // if (!isValid) {
    //   return new NextResponse('Invalid signature', { status: 403 });
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
      // These are not final statuses, so you might just log them
      console.log(`ℹ️ Transaction ${depositId} status: ${status}`);
    }

    // 4. Return an HTTP 200 OK response to pawaPay
    // This acknowledges receipt and stops pawaPay from retrying the callback
    return new NextResponse('Callback received', { status: 200 });

  } catch (error) {
    console.error('Error handling pawaPay callback:', error);
    // Return an error status if your internal processing fails, 
    // allowing pawaPay to potentially retry (they retry for 15 mins).
    return new NextResponse('Internal server error', { status: 500 });
  }
}
