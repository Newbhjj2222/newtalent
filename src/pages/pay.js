"use client";
import { useState } from "react";

export default function PayPage() {
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("Daily");
  const [provider, setProvider] = useState("MTN_MOMO_RWA");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handlePay = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      setMsg("Username not found in localStorage. Login first.");
      return;
    }

    setLoading(true);
    setMsg("");

    const res = await fetch("/api/pawapay-deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        phone,
        plan,
        provider,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMsg("Error: " + (data.error || "Payment failed"));
      return;
    }

    setMsg("SUCCESS: Payment initiated");
    console.log("PAWAPAY RESPONSE:", data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>PawaPay Deposit</h2>

      <div>
        <label>Phone:</label>
        <input
          type="text"
          placeholder="2507xxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label>Plan:</label>
        <select value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="onestory">One Story</option>
          <option value="Daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="bestreader">Best Reader</option>
        </select>
      </div>

      <div>
        <label>Provider:</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="MTN_MOMO_RWA">MTN Rwanda</option>
          <option value="AIRTEL_RWA">Airtel Rwanda</option>
        </select>
      </div>

      <button onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>

      <p>{msg}</p>
    </div>
  );
