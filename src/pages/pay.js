// pages/pay.js
"use client";
import { useState } from "react";

export default function Pay() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  const handlePay = async () => {
    const username = localStorage.getItem("username") || "UNKNOWN_USER";

    const res = await fetch("/api/pawapay-pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        msisdn: phone,
        userId: username,   // HERE
      }),
    });

    const data = await res.json();
    console.log(data);

    if (data?.redirectUrl) {
      window.location.href = data.redirectUrl; // send user to payment page
    } else {
      alert("Payment failed: " + data.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Make Payment</h2>

      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handlePay}>Pay Now</button>
    </div>
  );
}
