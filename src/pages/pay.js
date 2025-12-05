"use client";
import { useState, useEffect } from "react";

export default function PayPage() {
  const [username, setUsername] = useState("");
  const [nesPoints, setNesPoints] = useState("10");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Mapping of nesPoints to amount (RWF)
  const nesPointsMapping = {
    "10": 10,
    "50": 50,
    "100": 100,
    "200": 200,
    "500": 500
  };

  const amount = nesPointsMapping[nesPoints];

  useEffect(() => {
    const u = localStorage.getItem("username");
    if (u) setUsername(u);
  }, []);

  const handlePay = async () => {
    if (!username) {
      setMsg("Username not found in localStorage");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          nesPoints,
          amount   //  <<<<<<<<<<  IMPORTANT: TURAYOHEREZA NONEHO
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        let errorMsg =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error;

        setMsg("Error: " + errorMsg);
        return;
      }

      // Redirect to payment page
      window.location.href = data.redirectUrl;

    } catch (err) {
      setLoading(false);
      setMsg("Network error: " + err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 10,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>💰 Buy NES Points</h2>

      <p><b>Logged as:</b> {username || "No username found"}</p>

      <div style={{ marginBottom: 15 }}>
        <label>NES Points:</label>

        <select
          value={nesPoints}
          onChange={(e) => setNesPoints(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 5,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        >
          <option value="10">10 NES Points</option>
          <option value="50">50 NES Points</option>
          <option value="100">100 NES Points</option>
          <option value="200">200 NES Points</option>
          <option value="500">500 NES Points</option>
        </select>

        <p style={{ marginTop: 5 }}>Amount: {amount} RWF</p>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 5,
          border: "none",
          backgroundColor: "#4CAF50",
          color: "#fff",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {msg && (
        <p
          style={{
            marginTop: 20,
            padding: 10,
            borderRadius: 5,
            backgroundColor: msg.startsWith("Error")
              ? "#f8d7da"
              : "#d4edda",
            color: msg.startsWith("Error") ? "#721c24" : "#155724",
          }}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
