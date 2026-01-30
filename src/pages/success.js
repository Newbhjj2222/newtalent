'use client';

import { useEffect, useState } from "react";
import { db } from "@/components/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Normalize username:
 * "Emmy", " emmy ", "EMMY" => "emmy"
 */
function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

export default function SuccessPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function processPayment() {
      try {
        // 1. Fata payload
        const params = new URLSearchParams(window.location.search);
        const payloadParam = params.get("payload");

        if (!payloadParam) {
          setError("No payload received");
          return;
        }

        const decoded = decodeURIComponent(payloadParam);
        const parsedData = JSON.parse(decoded);
        setData(parsedData);

        const transaction = parsedData?.data?.result?.[0];
        if (!transaction) {
          setError("No transaction data");
          return;
        }

        // 2. Fata customerId (username)
        const rawCustomerId = transaction.metadata?.customerId;
        const amount = Number(transaction.depositedAmount);

        if (!rawCustomerId || isNaN(amount)) {
          setError("Invalid payment data");
          return;
        }

        // 3. Normalize username
        const customerId = normalizeUsername(rawCustomerId);

        // 4. Hitamo plan na NES hashingiwe ku mafaranga
        let plan = "";
        let nes = 0;

        switch (amount) {
          case 10:
            plan = "single";
            nes = 1;
            break;
          case 150:
            plan = "daily";
            nes = 15;
            break;
          case 250:
            plan = "weekly";
            nes = 25;
            break;
          case 400:
            plan = "bestreader";
            nes = 50;
            break;
          default:
            plan = "unknown";
            nes = 0;
        }

        // 5. Reba niba user asanzwe ari muri Firestore
        const depositerRef = doc(db, "depositers", customerId);
        const existingDoc = await getDoc(depositerRef);

        let totalNES = nes;

        if (existingDoc.exists()) {
          const oldData = existingDoc.data();
          totalNES += oldData.nes || 0;
        }

        // 6. Andika / uvugurure user
        await setDoc(
          depositerRef,
          {
            username: rawCustomerId.trim(),       // uko user yanditse izina
            username_normalized: customerId,      // emmy
            plan,
            nes: totalNES,
            amount,
            lastPaymentAmount: amount,
            updatedAt: serverTimestamp(),
            createdAt: existingDoc.exists()
              ? existingDoc.data().createdAt
              : serverTimestamp(),
          },
          { merge: true }
        );

        // 7. Message & redirect
        setMessage(`Wahawe NES ${nes}. Ubu ufite zose ${totalNES}.`);

        setTimeout(() => {
          window.location.href = "https://www.newtalentsg.co.rw";
        }, 5000);

      } catch (err) {
        console.error("Payment processing error:", err);
        setError("Failed to process payment");
      }
    }

    processPayment();
  }, []);

  /* ================= UI ================= */

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  };

  const cardStyle = {
    maxWidth: "500px",
    width: "100%",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    padding: "30px",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "1.8rem",
    marginBottom: "15px",
    color: "#333",
  };

  const textStyle = {
    fontSize: "1.1rem",
    marginBottom: "10px",
    color: "#555",
  };

  const messageStyle = {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#0070f3",
    marginTop: "20px",
  };

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Payment Error</h1>
          <p style={textStyle}>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Processing payment...</h1>
        </div>
      </div>
    );
  }

  const transaction = data?.data?.result?.[0];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Payment Status</h1>

        <p style={textStyle}>
          <strong>Status:</strong> {data.status}
        </p>

        {transaction && (
          <>
            <p style={textStyle}>
              <strong>Deposit ID:</strong> {transaction.depositId}
            </p>
            <p style={textStyle}>
              <strong>Amount:</strong> {transaction.depositedAmount} {transaction.currency}
            </p>
            <p style={textStyle}>
              <strong>Customer:</strong> {transaction.metadata?.customerId}
            </p>
            <p style={textStyle}>
              <strong>Order ID:</strong> {transaction.metadata?.orderId}
            </p>
            <p style={textStyle}>
              <strong>Method:</strong> {transaction.correspondent}
            </p>
          </>
        )}

        {message && <p style={messageStyle}>{message}</p>}
      </div>
    </div>
  );
}
