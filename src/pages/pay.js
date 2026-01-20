"use client";
import { useState, useEffect } from "react";

export default function PayPage() {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [country, setCountry] = useState("RWA");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [depositId, setDepositId] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("username");
    if (u) setUsername(u);
  }, []);

  const generateLink = async () => {
    if (!username || !amount || !country) {
      setMsg("Shyiramo username, amount na country");
      return;
    }

    setLoading(true);
    setMsg("");
    setPaymentLink("");

    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, amount, reason, country }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg(JSON.stringify(data.error, null, 2));
        return;
      }

      setPaymentLink(data.redirectUrl);
      setDepositId(data.depositId);

    } catch (err) {
      setLoading(false);
      setMsg("Network error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 10 }}>
      <h2 style={{ textAlign: "center" }}>💳 Generate Payment Link</h2>

      <p><b>User:</b> {username || "Unknown"}</p>

      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (RWF)" style={{ width: "100%", marginBottom: 10, padding: 8 }} />
      <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" style={{ width: "100%", marginBottom: 10, padding: 8 }} />
      <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: "100%", marginBottom: 10, padding: 8 }}>
        <option value="RWA">Rwanda</option>
        <option value="UGA">Uganda</option>
        <option value="KEN">Kenya</option>
        <option value="GHA">Ghana</option>
      </select>

      <button onClick={generateLink} disabled={loading} style={{ width: "100%", padding: 10, backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 5 }}>
        {loading ? "Generating..." : "Generate Payment Link"}
      </button>

      {paymentLink && (
        <div style={{ marginTop: 20 }}>
          <p>🔗 Payment Link:</p>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">{paymentLink}</a>
        </div>
      )}

      {msg && <pre style={{ marginTop: 15, padding: 10, background: "#fee2e2", color: "#7f1d1d", borderRadius: 6 }}>{msg}</pre>}
    </div>
  );
}
