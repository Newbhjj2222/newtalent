"use client";
import { useState, useEffect } from "react";

export default function PayPage() {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("username");
    if (u) setUsername(u);
  }, []);

  const generateLink = async () => {
    if (!amount || Number(amount) < 100) {
      setMsg("Shyiramo amafaranga nibura 100 RWF");
      return;
    }

    setLoading(true);
    setMsg("");
    setPaymentLink("");

    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          amount,
          reason,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        if (typeof data.error === "object") {
          setMsg(JSON.stringify(data.error, null, 2));
        } else {
          setMsg(String(data.error || "Payment failed"));
        }
        return;
      }

      setPaymentLink(data.redirectUrl);

    } catch (err) {
      setLoading(false);
      setMsg(err.message);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "50px auto",
      padding: 20,
      border: "1px solid #ccc",
      borderRadius: 10,
    }}>
      <h2 style={{ textAlign: "center" }}>💳 Generate Payment Link</h2>

      <p><b>User:</b> {username || "Unknown"}</p>

      <div style={{ marginBottom: 15 }}>
        <label>Amafaranga (RWF)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Urugero: 1000"
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Impamvu yo kwishyura</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Urugero: Subscription"
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      <button
        onClick={generateLink}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 5,
        }}
      >
        {loading ? "Generating..." : "Generate Payment Link"}
      </button>

      {paymentLink && (
        <div style={{ marginTop: 20 }}>
          <p>🔗 Payment Link:</p>
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2563eb", wordBreak: "break-all" }}
          >
            {paymentLink}
          </a>
        </div>
      )}

      {msg && (
        <pre
          style={{
            marginTop: 15,
            padding: 10,
            background: "#fee2e2",
            color: "#7f1d1d",
            borderRadius: 6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: 12,
          }}
        >
          {msg}
        </pre>
      )}
    </div>
  );
}
