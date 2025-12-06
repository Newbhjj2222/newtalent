"use client";
import { useState } from "react";

export default function PayoutPage() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayout = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/payout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, phone })
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Withdraw (Payout)</h1>

      <div>
        <label>Amount (RWF)</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
        />
      </div>

      <div>
        <label>Phone Number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="text"
        />
      </div>

      <button onClick={handlePayout} disabled={loading}>
        {loading ? "Processing..." : "Withdraw Now"}
      </button>

      <h3>Response:</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
