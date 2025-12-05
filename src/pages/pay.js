"use client";
import { useState, useEffect } from "react";

export default function PayPage() {
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("Daily");
  const [provider, setProvider] = useState("MTN_MOMO_RWA");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");

  // Fata username muri localStorage
  useEffect(() => {
    const u = localStorage.getItem("username");
    if (u) setUsername(u);
  }, []);

  const handlePay = async () => {
    if (!username) {
      setMsg("Username not found in localStorage. Please login first.");
      return;
    }

    if (!phone) {
      setMsg("Please enter phone number");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/pawapay-deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log(data);
    } catch (err) {
      setLoading(false);
      setMsg("Network error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>PawaPay Deposit</h2>

      <p><b>Logged as:</b> {username || "No username found"}</p>

      <div style={{ marginBottom: 10 }}>
        <label>Phone:</label><br />
        <input
          type="text"
          placeholder="2507xxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Plan:</label><br />
        <select value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="onestory">One Story</option>
          <option value="Daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="bestreader">Best Reader</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Provider:</label><br />
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

      <p style={{ marginTop: 20 }}>{msg}</p>
    </div>
  );
}
