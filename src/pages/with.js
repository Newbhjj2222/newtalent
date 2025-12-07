// pages/payout.js

import { useState } from "react";

export default function PayoutPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("MTN-MOMO-RW");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const submit = async () => {
    setLoading(true);
    setResult(null);

    const cleanPhone = phone.replace(/\D/g, "");

    const externalId = uuidv4();

    const res = await fetch("/api/payout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: cleanPhone,
        amount,
        currency: "RWF",
        provider,
        externalId
      }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Payout (Withdraw)</h1>

      <input
        placeholder="Phone (2507xxxxxxx)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /><br /><br />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /><br /><br />

      <select value={provider} onChange={(e) => setProvider(e.target.value)}>
        <option value="MTN-MOMO-RW">MTN Rwanda</option>
        <option value="AIRTEL-MONEY-RW">Airtel Rwanda</option>
      </select><br /><br />

      <button onClick={submit} disabled={loading}>
        {loading ? "Processing..." : "Withdraw"}
      </button>

      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
