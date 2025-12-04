import { useState } from "react";

export default function PayPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [telco, setTelco] = useState("MTN");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          amount: Number(amount),
          telco,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("Error: " + (data.error || "Payment failed"));
      } else {
        setMessage("Payment request sent! Reba kuri phone yawe wemere USSD.");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 420, margin: "50px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>PowerPay Payment</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        
        <label>Phone Number</label>
        <input
          type="text"
          placeholder="078xxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <label>Amount</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <label>Select Telco</label>
        <select
          value={telco}
          onChange={(e) => setTelco(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value="MTN">MTN</option>
          <option value="AIRTEL">AIRTEL</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 20, color: "#333", fontWeight: "bold", textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
}
