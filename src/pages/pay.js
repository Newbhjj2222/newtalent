// pages/pay.js

import { useState } from "react";

export default function Pay() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("");
  const [result, setResult] = useState(null);

  const submitPayment = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/pawapay/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount, provider })
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ maxWidth:"400px", margin:"50px auto" }}>
      <h2>PawaPay Payment</h2>

      <form onSubmit={submitPayment}>
        <input
          type="text"
          placeholder="Phone number (FULL MSISDN)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        /><br/><br/>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        /><br/><br/>

        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="">Select provider</option>
          <option value="MTN_MOMO_RWA">MTN Rwanda</option>
          <option value="AIRTEL_RWA">Airtel Rwanda</option>
          <option value="VODACOM_MOZ">Vodacom Mozambique</option>
          <option value="MTN_MOMO_ZMB">MTN Zambia</option>
          <option value="AIRTEL_OAPI_ZMB">Airtel Zambia</option>
          <option value="ZAMTEL_ZMB">Zamtel Zambia</option>
        </select>

        <br/><br/>

        <button>Pay Now</button>
      </form>

      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
