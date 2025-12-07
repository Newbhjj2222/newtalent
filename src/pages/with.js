"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function PayoutPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [userId, setUserId] = useState("");

  // Retrieve or create userId in localStorage
  useEffect(() => {
    let stored = localStorage.getItem("userId");
    if (!stored) {
      stored = Math.floor(Math.random() * 1000000000).toString();
      localStorage.setItem("userId", stored);
    }
    setUserId(stored);
  }, []);

  const handlePayout = async () => {
    setStatus("Processing payout...");
    setResponseData(null);

    try {
      const response = await axios.post("/api/pawapay-payout", {
        phone,
        amount,
        userId,
      });

      if (response.data.success) {
        setStatus("Success!");
        setResponseData(response.data);
      } else {
        setStatus("Failed");
        setResponseData(response.data);
      }
    } catch (error) {
      setStatus("Error");

      let data;
      if (error.response?.data) {
        data = error.response.data;
      } else {
        data = { message: error.message };
      }
      setResponseData(data);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>PawaPay Live Payout</h1>

      <input
        type="text"
        placeholder="Phone number (e.g. 078XXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginBottom: 10, width: "250px" }}
      />
      <br />

      <input
        type="number"
        placeholder="Amount (integer RWF)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginBottom: 10, width: "250px" }}
      />
      <br />

      <button onClick={handlePayout} style={{ padding: "5px 15px" }}>
        Send Payout
      </button>

      <h3>Status: {status}</h3>

      {responseData && (
        <div style={{ marginTop: 10 }}>
          <h4>Response:</h4>
          <pre
            style={{
              background: "#f5f5f5",
              padding: 10,
              borderRadius: 5,
              overflowX: "auto",
            }}
          >
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}

      <p>User ID: {userId}</p>
    </div>
  );
}
