// app/api/pawapay-callback/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // pawaPay sometimes sends raw body – so get text first
    const rawBody = await request.text();
    console.log("RAW CALLBACK:", rawBody);

    // Then parse JSON manually
    let callbackData = {};
    try {
      callbackData = JSON.parse(rawBody);
    } catch (e) {
      console.log("❌ Failed to parse JSON");
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    console.log("PARSED CALLBACK:", callbackData);

    const transactionId = callbackData.transactionId;
    const status = callbackData.status;
    const amount = callbackData.amount?.value;
    const currency = callbackData.amount?.currency;

    if (!transactionId) {
      console.log("❌ No transactionId");
      return NextResponse.json(
        { error: "Missing transactionId" },
        { status: 400 }
      );
    }

    // Handle statuses
    if (status === "COMPLETED") {
      console.log(`✅ ${transactionId} COMPLETED: ${amount} ${currency}`);
    } else if (status === "FAILED") {
      console.log(`❌ ${transactionId} FAILED`, callbackData.failureReason);
    } else {
      console.log(`ℹ️ ${transactionId} STATUS: ${status}`);
    }

    // Return success to pawaPay
    return NextResponse.json(
      { message: "OK" },
      { status: 200 }
    );

  } catch (err) {
    console.error("🔥 INTERNAL SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
