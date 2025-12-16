// pages/success.js
'use client';

import { useEffect, useState } from "react";
import { db } from "@/components/firebase"; // shaka aho firebase.js iherereye
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SuccessPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function processPayment() {
      try {
        // Soma payload muri URL
        const params = new URLSearchParams(window.location.search);
        const payloadParam = params.get("payload");

        if (!payloadParam) {
          setError("No payload received");
          return;
        }

        // Decode URL → JSON
        const decoded = decodeURIComponent(payloadParam);
        const parsedData = JSON.parse(decoded);

        setData(parsedData);

        // Fata transaction ya mbere
        const transaction = parsedData?.data?.result?.[0];
        if (!transaction) return;

        const customerId = transaction.metadata?.customerId;
        const amount = Number(transaction.depositedAmount);

        if (!customerId || isNaN(amount)) return;

        // Shyiraho plan, nes na createdAt hashingiwe ku amount
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
          case 500:
            plan = "monthly";
            nes = 60;
            break;
          case 800:
            plan = "bestreader";
            nes = 1000;
            break;
          default:
            plan = "unknown";
            nes = 0;
        }

        // Shyira muri Firestore collection 'depositers', document yitwa customerId
        const depositerRef = doc(db, "depositers", customerId);

        await setDoc(depositerRef, {
          plan,
          nes,
          createdAt: serverTimestamp(),
        }, { merge: true }); // merge: true ihindura gusa ibyo bidahari

        console.log("Deposit updated in Firestore!");
      } catch (err) {
        console.error("Error processing payment:", err);
        setError("Failed to process payment");
      }
    }

    processPayment();
  }, []);

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: "Arial" }}>
        <h1>Payment Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 40, fontFamily: "Arial" }}>
        <h1>Processing payment...</h1>
      </div>
    );
  }

  const transaction = data?.data?.result?.[0];

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Payment Status</h1>

      <p>
        <strong>Status:</strong> {data.status}
      </p>

      {transaction && (
        <>
          <hr />

          <p>
            <strong>Deposit ID:</strong> {transaction.depositId}
          </p>
          <p>
            <strong>Amount:</strong>{" "}
            {transaction.depositedAmount} {transaction.currency}
          </p>
          <p>
            <strong>Customer ID:</strong>{" "}
            {transaction.metadata?.customerId}
          </p>
          <p>
            <strong>Order ID:</strong>{" "}
            {transaction.metadata?.orderId}
          </p>
          <p>
            <strong>Payment Method:</strong>{" "}
            {transaction.correspondent}
          </p>
        </>
      )}
    </div>
  );
      }
