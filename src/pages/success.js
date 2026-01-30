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
        /* =======================
           1. FATA PAYLOAD
        ======================== */
        const params = new URLSearchParams(window.location.search);
        const payloadParam = params.get("payload");

        if (!payloadParam) {
          throw new Error("No payload received");
        }

        const decoded = decodeURIComponent(payloadParam);
        const parsedData = JSON.parse(decoded);
        setData(parsedData);

        const transaction = parsedData?.data?.result?.[0];
        if (!transaction) {
          throw new Error("No transaction found");
        }

        /* =======================
           2. DATA Z'INGENZI
        ======================== */
        const rawCustomerId = transaction.metadata?.customerId;
        const amount = parseInt(transaction.depositedAmount, 10);

        if (!rawCustomerId) {
          throw new Error("CustomerId missing");
        }

        if (!Number.isFinite(amount)) {
          throw new Error("Invalid amount");
        }

        /* =======================
           3. NORMALIZE USERNAME
        ======================== */
        const customerId = normalizeUsername(rawCustomerId);

        /* =======================
           4. PLAN & NES
        ======================== */
        let plan = "unknown";
        let nes = 0;

        switch (amount) {
          case 10:
            plan = "single";
            nes = 1;
            break;
          case 150:
            plan = "daily";
            nes = 12;
            break;
          case 250:
            plan = "weekly";
            nes = 20;
            break;
          case 400:
            plan = "bestreader";
            nes = 40;
            break;
        }

        /* =======================
           5. FIRESTORE LOGIC
        ======================== */
        const depositerRef = doc(db, "depositers", customerId);
        const existingDoc = await getDoc(depositerRef);

        let totalNES = nes;

        if (existingDoc.exists()) {
          const oldData = existingDoc.data();
          totalNES += Number(oldData.nes || 0);
        }

        /* =======================
           6. SAVE (NO ERROR HERE)
        ======================== */
        await setDoc(
          depositerRef,
          {
            username: rawCustomerId.trim(),
            username_normalized: customerId,
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
            <p><strong>User:</strong> {transaction.metadata?.customerId}</p>
          </>
        )}

        {message && <p style={{ marginTop: 20, fontWeight: "bold" }}>{message}</p>}
      </div>
    </div>
  );
}
