"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function PayoutPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");

  // Save or retrieve userId from localStorage
  useEffect(() => {
    let stored = localStorage.getItem("userId");
    if (!stored) {
      stored = Math.floor(Math.random() * 1000000000).toString(); // random numeric userId
      localStorage.setItem("userId", stored);
    }
    setUserId(stored);
  }, []);

  const handlePayout = async () => {
    setStatus("Processing payout...");

    try {
      const response = await axios.post("/api/pawapay-payout", {
        phone,
        amount,
        userId,
      });

      if (response.data.success) {
        setStatus(`Success! Payout ID: ${response.data.payoutId}`);
      } else {
        setStatus(`Failed: ${response.data.message}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>PawaPay Payout</h1>

      <input
        type="text"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <br />

      <button onClick={handlePayout}>Send Payout</button>

      <p>{status}</p>
      <p>User ID: {userId}</p>
    </div>
  );
}
