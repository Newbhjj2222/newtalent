// pay.js
"use client";

import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function Pay() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [response, setResponse] = useState(null);

  const sendPayout = async () => {
    const payoutId = uuidv4();

    const username = localStorage.getItem("username") || "guest_user";

    // METADATA AS ARRAY (NO DUPLICATES)
    const metadata = [
      { fieldName: "username", value: username },
      { fieldName: "transactionType", value: "payout" },
      { fieldName: "platform", value: "web" }
    ];

    try {
      const res = await axios.post("/api/payout", {
        payoutId,
        amount: Number(amount),
        currency: "RWF",
        phoneNumber: phone,
        country: "RW",
        payoutMethod: "MOBILE_MONEY",
        metadata
      });

      setResponse(res.data);
    } catch (err) {
      setResponse(err.response?.data || err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Payout Form</h2>

      <input
        type="text"
        placeholder="Amount"
        onChange={e => setAmount(e.target.value)}
      /><br/><br/>

      <input
        type="text"
        placeholder="Phone Number"
        onChange={e => setPhone(e.target.value)}
      /><br/><br/>

      <button onClick={sendPayout} style={{ padding: 10, background: "blue", color: "white" }}>
        Send Payout
      </button>

      {response && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
