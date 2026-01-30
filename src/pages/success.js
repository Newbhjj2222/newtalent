'use client';

import { useEffect, useState } from "react";
import { db } from "@/components/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

/**
 * Normalize username for search only
 * "NewtalentsG", "newtalentsg", "NEWTALENTSG" => "newtalentsg"
 */
function normalizeUsername(value) {
  return value.toString().trim().toLowerCase();
}

/**
 * Find existing user (case-insensitive)
 */
async function findUserByUsername(rawUsername) {
  const key = normalizeUsername(rawUsername);

  const q = query(
    collection(db, "depositers"),
    where("username_key", "==", key)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    return snap.docs[0]; // existing user
  }

  return null;
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
        if (!payloadParam) throw new Error("No payload");

        const decoded = decodeURIComponent(payloadParam);
        const parsedData = JSON.parse(decoded);
        setData(parsedData);

        const transaction = parsedData?.data?.result?.[0];
        if (!transaction) throw new Error("No transaction");

        /* =======================
           2. IMPORTANT DATA
        ======================== */
        const rawCustomerId = transaction.metadata?.customerId;
        const amount = Number(transaction.depositedAmount);

        if (!rawCustomerId) throw new Error("Missing customerId");
        if (!Number.isFinite(amount)) throw new Error("Invalid amount");

        const usernameDisplay = rawCustomerId.trim();          // NewtalentsG
        const usernameKey = normalizeUsername(rawCustomerId); // newtalentsg

        /* =======================
           3. PLAN & NES
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
           4. FIND OR CREATE USER
        ======================== */
        const existingUser = await findUserByUsername(rawCustomerId);

        const depositerRef = existingUser
          ? existingUser.ref
          : doc(collection(db, "depositers")); // auto ID

        let totalNES = nes;

        if (existingUser) {
          totalNES += Number(existingUser.data().nes || 0);
        }

        /* =======================
           5. SAVE TO FIRESTORE
        ======================== */
        await setDoc(
          depositerRef,
          {
            username: usernameDisplay, // exact as typed
            username_key: usernameKey, // lowercase search key
            plan,
            nes: totalNES,
            lastPaymentAmount: amount,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        /* =======================
           6. SUCCESS
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
  if (error) {
    return <div style={{ padding: 40 }}>❌ {error}</div>;
  }

  if (!data) {
    return <div style={{ padding: 40 }}>Processing payment...</div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Payment Successful</h2>
      {message && <p><strong>{message}</strong></p>}
    </div>
  );
}
