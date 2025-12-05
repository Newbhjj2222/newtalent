"use client";
import { useState, useEffect } from "react";

export default function PayPage() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("MTN_MOMO_RWA");
  const [nesPoints, setNesPoints] = useState("10");
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const nesPointsMapping = { "10":10, "50":50, "100":100, "200":200, "500":500 };

  useEffect(() => {
    const u = localStorage.getItem("username");
    if (u) setUsername(u);
  }, []);

  useEffect(() => {
    setAmount(nesPointsMapping[nesPoints]);
  }, [nesPoints]);

  const handlePay = async () => {
    if (!username || !phone || !provider || !nesPoints) {
      setMsg("Please fill all fields correctly.");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      setMsg("Phone number must be in international format, e.g., 2507xxxxxxx");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/pawapay-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, phone, provider, nesPoints }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg("Error: " + (data.error || "Payment failed"));
        return;
      }

      setMsg(`✅ SUCCESS: Payment of ${amount} RWF initiated`);
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
        <label>NES Points:</label>
        <select value={nesPoints} onChange={e => setNesPoints(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 5, borderRadius: 5, border: "1px solid #ccc" }}>
          <option value="10">10 NES Points</option>
          <option value="50">50 NES Points</option>
          <option value="100">100 NES Points</option>
          <option value="200">200 NES Points</option>
          <option value="500">500 NES Points</option>
        </select>
        <p style={{ marginTop: 5 }}>Amount: {amount} RWF</p>
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
