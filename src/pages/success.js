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
        // 1. GET PAYLOAD
        const params = new URLSearchParams(window.location.search);
        const payloadParam = params.get("payload");
        if (!payloadParam) throw new Error("No payload");

        const decoded = decodeURIComponent(payloadParam);
        const parsedData = JSON.parse(decoded);
        setData(parsedData);

        const transaction = parsedData?.data?.result?.[0];
        if (!transaction) throw new Error("No transaction");

        // 2. IMPORTANT DATA
        const username = transaction.metadata?.customerId?.trim();
        const amount = Number(transaction.depositedAmount);

        if (!username) throw new Error("Missing customerId");
        if (!Number.isFinite(amount)) throw new Error("Invalid amount");

        // 3. PLAN & NES
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

        // 4. FETCH EXISTING DOC
        const depositerRef = doc(db, "depositers", username);
        const existingDoc = await getDoc(depositerRef);

        if (existingDoc.exists()) {
          // Document ihari -> update NES gusa
          const oldData = existingDoc.data();
          const totalNES = (Number(oldData.nes) || 0) + nes;

          await setDoc(
            depositerRef,
            {
              nes: totalNES,
              plan,
              lastPaymentAmount: amount,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          setMessage(`Wongeye NES ${nes}. Ubu ufite zose ${totalNES}.`);
        } else {
          // Document ntihari -> shyiramo nshya
          await setDoc(depositerRef, {
            username,
            plan,
            nes,
            lastPaymentAmount: amount,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          setMessage(`Murakaza neza! Wahawe NES ${nes}.`);
        }

        // 5. REDIRECT
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

  // UI
  if (error) return <div style={{ padding: 40 }}>❌ {error}</div>;
  if (!data) return <div style={{ padding: 40 }}>Processing payment...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Payment Successful</h2>
      {message && <p><strong>{message}</strong></p>}
    </div>
  );
}
