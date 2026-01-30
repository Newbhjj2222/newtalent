'use client';

import { useEffect, useState } from "react";
import { db } from "@/components/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Capitalize first letter only
 * " emmy " => "Emmy"
 * "EMMY"   => "Emmy"
 */
function capitalize(value) {
  if (!value) return "";
  const v = value.toString().trim().toLowerCase();
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export default function SuccessPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function processPayment() {
      try {
        /* =======================
           1. GET PAYLOAD
        ======================== */
        const params = new URLSearchParams(window.location.search);
        const payloadParam = params.get("payload");

        if (!payloadParam) throw new Error("no payload");

        const decoded = decodeURIComponent(payloadParam);
        const parsedData = JSON.parse(decoded);
        setData(parsedData);

        const transaction = parsedData?.data?.result?.[0];
        if (!transaction) throw new Error("no transaction");

        /* =======================
           2. IMPORTANT DATA
        ======================== */
        const rawCustomerId = transaction.metadata?.customerId;
        const amount = Number(transaction.depositedAmount);

        if (!rawCustomerId) throw new Error("missing customerId");
        if (!Number.isFinite(amount)) throw new Error("invalid amount");

        /* =======================
           3. CAPITALIZE USERNAME
        ======================== */
        const customerId = capitalize(rawCustomerId); // Document ID

        /* =======================
           4. PLAN & NES
        ======================== */
        let plan = "Unknown";
        let nes = 0;

        switch (amount) {
          case 10:
            plan = "Single";
            nes = 1;
            break;
          case 150:
            plan = "Daily";
            nes = 12;
            break;
          case 250:
            plan = "Weekly";
            nes = 20;
            break;
          case 400:
            plan = "BestReader";
            nes = 40;
            break;
        }

        /* =======================
           5. FIRESTORE
           (Document ID = Uppercase start)
        ======================== */
        const depositerRef = doc(db, "depositers", customerId);
        const existingDoc = await getDoc(depositerRef);

        let totalNES = nes;

        if (existingDoc.exists()) {
          const oldData = existingDoc.data();
          totalNES += Number(oldData.nes || 0);
        }

        /* =======================
           6. SAVE DATA
        ======================== */
        await setDoc(
          depositerRef,
          {
            username: customerId,
            plan,
            nes: totalNES,
            lastPaymentAmount: amount,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        /* =======================
           7. SUCCESS MESSAGE
        ======================== */
        setMessage(`Wahawe NES ${nes}. Ubu ufite zose ${totalNES}.`);

        setTimeout(() => {
          window.location.href = "https://www.newtalentsg.co.rw";
        }, 5000);

      } catch (err) {
        console.error("PROCESS PAYMENT ERROR:", err);
        setError("Failed to process payment");
      }
    }

    processPayment();
  }, []);

  /* =======================
     UI
  ======================== */
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(135deg,#fdfbfb,#ebedee)",
  };

  const cardStyle = {
    maxWidth: "500px",
    width: "100%",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,.1)",
    padding: "30px",
    textAlign: "center",
  };

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2>Payment Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2>Processing payment...</h2>
        </div>
      </div>
    );
  }

  const transaction = data?.data?.result?.[0];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Payment Successful</h2>

        <p><strong>Status:</strong> {data.status}</p>

        {transaction && (
          <>
            <p><strong>Deposit ID:</strong> {transaction.depositId}</p>
            <p><strong>Amount:</strong> {transaction.depositedAmount} {transaction.currency}</p>
            <p><strong>User:</strong> {customerId}</p>
          </>
        )}

        {message && (
          <p style={{ marginTop: 20, fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
