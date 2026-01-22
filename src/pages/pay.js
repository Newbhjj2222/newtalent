// pages/pay.js
import { useState } from "react";

export default function Pay() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount) {
      setError("Hitamo amafaranga ubanze");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (data.redirectUrl) {
        // 🔴 Redirect kuri PawaPay Payment Page
        window.location.href = data.redirectUrl;
      } else {
        setError("Ntibyashobotse gutangiza payment");
      }
    } catch (err) {
      setError("Habaye ikibazo, ongera ugerageze");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handlePay} style={styles.card}>
        <h2 style={styles.title}>Hitamo amafaranga yo kwishyura</h2>

        <select
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Hitamo amafaranga --</option>
          <option value="1000">1,000 RWF</option>
          <option value="2000">2,000 RWF</option>
          <option value="5000">5,000 RWF</option>
          <option value="10000">10,000 RWF</option>
          <option value="20000">20,000 RWF</option>
          <option value="50000">50,000 RWF</option>
        </select>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Tegereza..." : "Next"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fa",
  },
  card: {
    background: "#fff",
    padding: "30px",
    width: "100%",
    maxWidth: "400px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
    textAlign: "center",
  },
};
