"use client";

import { useState } from "react";

export default function PayoutPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // Generate random reference
  const generateRef = () =>
    "REF" + Math.floor(Math.random() * 1000000000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    const ref = generateRef();

    try {
      const res = await fetch("/api/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: ref,
          phone,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("❌ " + (data.error || "Payout failed"));
      } else {
        setMessage("✅ Success: " + JSON.stringify(data));
      }
    } catch (error) {
      setMessage("❌ Network error: " + error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Payout (Withdraw)</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Phone (07...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br />

        <input
          type="number"
          placeholder="Amount (RWF)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />

        <button type="submit">Send Payout</button>
      </form>

      <div style={{ marginTop: 20 }}>{message}</div>
    </div>
  );
}
