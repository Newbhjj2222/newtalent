// /pages/payout.js

import { useState } from "react";

export default function PayoutPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submitPayout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("Processing payout...");

    try {
      const res = await fetch("/api/payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, amount })
      });

      const raw = await res.text();
      let data;

      try {
        data = JSON.parse(raw);
      } catch {
        data = raw;
      }

      setMsg(JSON.stringify(data, null, 2));
    } catch (err) {
      setMsg("Network error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>PawaPay Withdrawal</h1>

      <form onSubmit={submitPayout} style={styles.form}>
        <input
          type="tel"
          placeholder="Phone 078XXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="number"
          placeholder="Amount (RWF)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Processing..." : "Withdraw Now"}
        </button>
      </form>

      <pre style={styles.responseBox}>{msg}</pre>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "26px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  btn: {
    background: "#1A73E8",
    color: "#fff",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  responseBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#f4f4f4",
    borderRadius: "8px",
    minHeight: "150px",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
  },
};
