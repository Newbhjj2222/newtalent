// app/api/pawapay-callback/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    let callbackData = {};
    try {
      callbackData = await request.json();
    } catch (e) {
      console.log("⚠️ No JSON body received");
    }

    console.log("Received pawaPay callback:", callbackData);

    const transactionId = callbackData.transactionId;
    const status = callbackData.status;
    const amount = callbackData.amount?.value;
    const currency = callbackData.amount?.currency;

    if (status === "COMPLETED") {
      console.log(`✅ ${transactionId} COMPLETED: ${amount} ${currency}`);
    } else if (status === "FAILED") {
      console.log(`❌ ${transactionId} FAILED`, callbackData.failureReason);
    } else {
      console.log(`ℹ️ ${transactionId} STATUS: ${status}`);
    }

    return NextResponse.json(
      { message: "Callback received" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
