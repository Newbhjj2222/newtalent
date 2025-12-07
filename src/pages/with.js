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

    // Input validation
    if (!phone || !amount) {
      setStatus("Please fill in phone and amount");
      return;
    }
    if (!validatePhone(phone)) {
      setStatus("Invalid phone number format");
      return;
    }
    if (!validateAmount(amount)) {
      setStatus("Amount must be an integer between 100 and 1,000,000 RWF");
      return;
    }

    try {
      const payload = {
        phone,
        amount,
        userId,
      };

      console.log("Sending payload to backend:", payload);

      const response = await axios.post("/api/pawapay-payout", payload);

      if (response.data.success) {
        setStatus("Success!");
        setResponseData(response.data);
      } else {
        setStatus("Failed");
        setResponseData(response.data);
      }
    } catch (error) {
      setStatus("Error occurred");

      let data;
      if (error.response?.data) {
        data = error.response.data;
      } else {
        data = { message: error.message };
      }
      console.error("Error response:", data);
      setResponseData(data);
    }
  };

  // Helper functions for validation
  const validatePhone = (phone) => {
    const pattern = /^(?:\+?250|0)(7[8|2|3|4|5|6|9])\d{7}$/;
    return pattern.test(phone);
  };

  const validateAmount = (amount) => {
    const num = Number(amount);
    return Number.isInteger(num) && num >= 100 && num <= 1000000;
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
