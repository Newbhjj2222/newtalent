import crypto from "crypto";

export async function POST(request) {
  try {
    const { phone, amount, reference } = await request.json();

    const token = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

    // Determine product by prefix
    let product = "MTN-MOMO-RW";
    const num = phone.replace("+", "").replace("250", "");

    if (num.startsWith("78") || num.startsWith("79")) {
      product = "AIRTEL-MONEY-RW";
    }

    const payload = {
      reference,
      amount,
      currency: "RWF",
      product,
      customerTimestamp: new Date().toISOString(),
      payee: {
        partyIdType: "MSISDN",
        partyId: phone,
      },
    };

    const res = await fetch("https://api.pawapay.cloud/payouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Idempotency-Key": crypto.randomUUID(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await res.json();

    return Response.json(body, { status: res.status });
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
