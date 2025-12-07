// pages/index.js
import { useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [response, setResponse] = useState(null);

  const sendPayout = async () => {
    setResponse("Sending...");

    const r = await fetch("/api/payout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount }),
    });

    const data = await r.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Send Payout</h2>

      <input
        style={styles.input}
        placeholder="Phone (e.g. 078XXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button style={styles.button} onClick={sendPayout}>
        Send Payout
      </button>

      <pre style={styles.response}>{response}</pre>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "40px auto",
    padding: 20,
    borderRadius: 12,
    background: "#fafafa",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#6a00ff",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
  },
  response: {
    marginTop: 20,
    fontSize: 14,
    background: "#fff",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    overflowX: "auto",
  },
};
