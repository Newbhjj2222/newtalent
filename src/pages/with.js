"use client";

import { useState } from "react";

export default function PayoutPage() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, phone }),
      });

      const data = await res.json();
      setLoading(false);
      setResult(data);
    } catch (error) {
      setLoading(false);
      setResult({ success: false, error: error.message });
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Withdraw (Payout)</h1>

      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Amount (RWF)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={styles.input}
          required
        />

        <label style={styles.label}>Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="2507XXXXXXXX"
          style={styles.input}
          required
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Processing..." : "Withdraw Now"}
        </button>
      </form>

      {result && (
        <div style={styles.responseBox}>
          <h3>Response:</h3>
          <pre style={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial",
  },
  title: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  label: { fontWeight: "bold" },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    background: "#0070f3",
    color: "white",
    padding: "12px",
    fontSize: "17px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  responseBox: {
    marginTop: "25px",
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "8px",
  },
  pre: { whiteSpace: "pre-wrap", wordBreak: "break-word" },
};
