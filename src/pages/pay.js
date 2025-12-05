"use client";
import { useState, useEffect } from "react";

export default function PayPage() {
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("Daily");
  const [provider, setProvider] = useState("MTN_MOMO_RWA");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("username");
    if (u) setUsername(u);
  }, []);

  const handlePay = async () => {
    if (!username) { setMsg("Missing parameter: username"); return; }
    if (!phone) { setMsg("Missing parameter: phone"); return; }
    if (!plan) { setMsg("Missing parameter: plan"); return; }
    if (!provider) { setMsg("Missing parameter: provider"); return; }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/pawapay-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, phone, plan, provider }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg("Error: " + (data.error || "Payment failed"));
        return;
      }

      setMsg("✅ SUCCESS: Payment initiated");
      console.log("PAWAPAY RESPONSE:", data);
    } catch (err) {
      setLoading(false);
      setMsg("Network error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 10 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>💰 PawaPay Deposit</h2>

      <p><b>Logged as:</b> {username || "No username found"}</p>

      <div style={{ marginBottom: 15 }}>
        <label>Phone:</label>
        <input type="text" placeholder="2507xxxxxxx" value={phone} onChange={e => setPhone(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 5, borderRadius: 5, border: "1px solid #ccc" }} />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Plan:</label>
        <select value={plan} onChange={e => setPlan(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 5, borderRadius: 5, border: "1px solid #ccc" }}>
          <option value="onestory">One Story - 10</option>
          <option value="Daily">Daily - 150</option>
          <option value="weekly">Weekly - 250</option>
          <option value="monthly">Monthly - 500</option>
          <option value="bestreader">Best Reader - 800</option>
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Provider:</label>
        <select value={provider} onChange={e => setProvider(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 5, borderRadius: 5, border: "1px solid #ccc" }}>
          <option value="MTN_MOMO_RWA">MTN Rwanda</option>
          <option value="AIRTEL_RWA">Airtel Rwanda</option>
        </select>
      </div>

      <button onClick={handlePay} disabled={loading}
        style={{ width: "100%", padding: 10, borderRadius: 5, border: "none", backgroundColor: "#4CAF50", color: "#fff", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {msg && (
        <p style={{ marginTop: 20, padding: 10, borderRadius: 5, backgroundColor: msg.startsWith("✅") ? "#d4edda" : "#f8d7da", color: msg.startsWith("✅") ? "#155724" : "#721c24" }}>
          {msg}
        </p>
      )}
    </div>
  );
}
