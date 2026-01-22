// pages/pay.js
import { useState } from "react";

export default function Pay() {
  const [amount, setAmount] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || !country) {
      setError("Hitamo igihugu n’amafaranga");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          country, // igihugu gihiswemo
        }),
      });

      const data = await res.json();

      if (data.redirectUrl) {
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
        <h2 style={styles.title}>Pay with PawaPay</h2>

        {/* SELECT COUNTRY */}
        <select
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  style={styles.select}
>
  <option value="">-- Hitamo igihugu --</option>

  <option value="RWA">🇷🇼 Rwanda</option>
  <option value="KEN">🇰🇪 Kenya</option>
  <option value="UGA">🇺🇬 Uganda</option>
  <option value="COD">🇨🇩 RDC (DR Congo)</option>
  <option value="COG">🇨🇬 Congo Brazzaville</option>
  <option value="ZMB">🇿🇲 Zambia</option>
</select>

        {/* SELECT AMOUNT */}
        <select
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Hitamo amafaranga --</option>
          <option value="400">400</option>
          <option value="1000">1,000</option>
          <option value="2000">2,000</option>
          <option value="5000">5,000</option>
          <option value="10000">10,000</option>
          <option value="20000">20,000</option>
          <option value="50000">50,000</option>
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
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
  },
  card: {
    background: "#fff",
    padding: "30px",
    width: "100%",
    maxWidth: "420px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    fontSize: "16px",
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
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "10px",
  },
};
