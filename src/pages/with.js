"use client";

import { useState } from "react";

// API TOKEN yawe (LIVE)
const API_KEY =
  'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA';

// Generate random UUID v4
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function PayoutPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  // sanitize phone to numbers only
  const cleanPhone = (num) => num.replace(/\D/g, "");

  const submitPayout = async () => {
    let msisdn = cleanPhone(phone);

    if (msisdn.startsWith("0")) {
      msisdn = msisdn.substring(1); // remove 0 prefix
    }

    if (msisdn.startsWith("250")) {
      msisdn = msisdn.substring(3); // remove 250
    }

    if (msisdn.length < 9) {
      setResponseMsg("Invalid phone number: must be 9 digits");
      return;
    }

    const payout_id = generateUUID();

    const payload = {
      payoutId: payout_id,
      payee: {
        msisdn: msisdn,
        provider: "MTN-MOMO-RW"
      },
      amount: {
        currency: "RWF",
        value: Number(amount)
      },
      statementDescription: "Withdrawal"
    };

    try {
      const res = await fetch("https://api.pawapay.io/v2/payouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: API_KEY
        },
        body: JSON.stringify(payload)
      });

      // we capture any response (json or text)
      const raw = await res.text();
      let data;

      try {
        data = JSON.parse(raw);
      } catch {
        data = raw;
      }

      setResponseMsg(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponseMsg("NETWORK ERROR: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>PawaPay Withdrawal</h1>

      <label>Phone Number</label>
      <input
        type="text"
        placeholder="7xxxxxxxx"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <label>Amount (RWF)</label>
      <input
        type="number"
        placeholder="150"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={submitPayout}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#0070f3",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: "bold"
        }}
      >
        Send Withdrawal
      </button>

      <pre
        style={{
          background: "#000",
          color: "#0f0",
          padding: "15px",
          marginTop: "20px",
          borderRadius: "10px",
          whiteSpace: "pre-wrap",
          fontSize: "14px"
        }}
      >
        {responseMsg}
      </pre>
    </div>
  );
}
