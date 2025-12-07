"use client";

import { useState } from "react";

export default function PayoutPage() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("RW-M-MTN");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const API_KEY = "Bearer eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const submitPayout = async () => {
    setLoading(true);
    setResponseMsg("");

    let cleanPhone = phone.replace(/\D/g, ""); // remove +, spaces, etc.

    const payoutId = uuidv4();

    const payload = {
      payoutId: payoutId,
      amount: {
        currency: "RWF",
        value: Number(amount)
      },
      customer: {
        phoneNumber: cleanPhone
      },
      product: "MTN-MOMO-RW",
      provider: provider
    };

    try {
      const res = await fetch("https://api.pawapay.io/v2/payouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_KEY
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setResponseMsg(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponseMsg("NETWORK ERROR: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>PawaPay Withdrawal (Payout)</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /><br/>

      <input
        type="text"
        placeholder="Phone (digits only)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /><br/>

      <select onChange={(e) => setProvider(e.target.value)} value={provider}>
        <option value="RW-M-MTN">MTN Rwanda</option>
        <option value="RW-M-AIRTEL">Airtel Rwanda</option>
      </select><br/>

      <button onClick={submitPayout} disabled={loading}>
        {loading ? "Processing..." : "Withdraw"}
      </button>

      <pre style={{ background: "#eee", marginTop: 20, padding: 10 }}>
        {responseMsg}
      </pre>
    </div>
  );
}
