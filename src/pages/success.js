// pages/success.js
'use client';

import { useEffect, useState } from "react";
import { db } from "@/components/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SuccessPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function processPayment() {
      try {
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
        if (!transaction) return;

        const customerId = transaction.metadata?.customerId;
        const amount = Number(transaction.depositedAmount);

        if (!customerId || isNaN(amount)) return;

        // Determine plan & NES based on amount
        let plan = "";
        let nes = 0;

        switch (amount) {
          case 10:
            plan = "single";
            nes = 1;
            break;
          case 150:
            plan = "Daily";
            nes = 15;
            break;
          case 250:
            plan = "weakly";
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

        const depositerRef = doc(db, "depositers", customerId);
        const existingDoc = await getDoc(depositerRef);

        let totalNES = nes;

        if (existingDoc.exists()) {
          const data = existingDoc.data();
          totalNES += data.nes || 0; // Guteranya NES zishyashya n’izari zihari
        }

        await setDoc(
          depositerRef,
          {
            plan,
            nes: totalNES,
            amount,
            timestamp: serverTimestamp(), // igihe nyacyo
          },
          { merge: true } // merge if doc exists
        );

        setMessage(`You have NES ${totalNES}! Redirecting...`);
        setTimeout(() => {
          window.location.href = "https://www.newtalentsg.co.rw";
        }, 5000);

      } catch (err) {
        console.error("Error processing payment:", err);
        setError("Failed to process payment");
      }
    }

    processPayment();
  }, []);

  // Responsive CSS
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
              <strong>Customer ID:</strong> {transaction.metadata?.customerId}
            </p>
            <p style={textStyle}>
              <strong>Order ID:</strong> {transaction.metadata?.orderId}
            </p>
            <p style={textStyle}>
              <strong>Payment Method:</strong> {transaction.correspondent}
            </p>
          </>
        )}

        {message && <p style={messageStyle}>{message}</p>}
      </div>
    </div>
  );
        }
