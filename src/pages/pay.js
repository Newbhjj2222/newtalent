"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PayPage() {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [country, setCountry] = useState("RWA");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [depositId, setDepositId] = useState("");

  // ✅ LIVE PawaPay Token
  const PAWAPAY_TOKEN = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

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
      // Generate unique depositId
      const depositId = crypto.randomUUID();

      // Body ya Payment Page API
      const body = {
        depositId,
        returnUrl: `https://www.newtalentsg.co.rw/payment-callback?depositId=${depositId}`,
        reason: reason || "Payment",
        amount: String(amount), // MUST be string
        country,
        metadata: { username },
      };

      // POST ku PawaPay Payment Page API
      const res = await axios.post(
        "https://api.pawapay.io/v2/paymentpage",
        body,
        {
          headers: {
            Authorization: `Bearer ${PAWAPAY_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.data?.redirectUrl) {
        setMsg("pawaPay ntiyagaruye redirectUrl. Reba response: " + JSON.stringify(res.data));
        setLoading(false);
        return;
      }

      setPaymentLink(res.data.redirectUrl);
      setDepositId(depositId);
      setLoading(false);

    } catch (err) {
      setMsg("Error: " + JSON.stringify(err.response?.data || err.message));
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 10 }}>
      <h2 style={{ textAlign: "center" }}>💳 Generate Payment Link</h2>

      <p><b>User:</b> {username || "Unknown"}</p>

      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount (RWF)"
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input
        type="text"
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Reason"
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <select
        value={country}
        onChange={e => setCountry(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      >
        <option value="RWA">Rwanda</option>
        <option value="UGA">Uganda</option>
        <option value="KEN">Kenya</option>
        <option value="GHA">Ghana</option>
      </select>

      <button
        onClick={generateLink}
        disabled={loading}
        style={{ width: "100%", padding: 10, backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 5 }}
      >
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
