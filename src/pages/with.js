"use client";
import { useState } from "react";

export default function PayoutPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayout = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount })
      });

      const data = await res.json();
      setMessage(data);
    } catch (err) {
      setMessage({ error: err.message });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h2>Payout (Withdraw) LIVE</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Phone:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07XXXXXXXX"
          style={{ width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Amount (RWF):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="150"
          style={{ width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>

      <button onClick={handlePayout} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Processing..." : "Withdraw"}
      </button>

      {message && (
        <div style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(message, null, 2)}
        </div>
      )}
    </div>
  );
}
