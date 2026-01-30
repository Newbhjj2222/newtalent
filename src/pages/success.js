'use client';

import { useEffect, useState } from "react";
import { db } from "@/components/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

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

/**
 * Normalize for search (case-insensitive)
 */
function normalizeKey(value) {
  return value.toString().trim().toLowerCase();
}

/**
 * Find existing user by username (case-insensitive)
 */
async function findUserByUsername(username) {
  const key = normalizeKey(username);

  const q = query(
    collection(db, "depositers"),
    where("username_key", "==", key)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    return snap.docs[0]; // found
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
           3. USERNAME LOGIC
        ======================== */
        const usernameDisplay = capitalize(rawCustomerId);   // Emmy
        const usernameKey = normalizeKey(rawCustomerId);     // emmy

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
           5. FIND OR CREATE USER
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
           6. SAVE DATA
        ======================== */
        await setDoc(
          depositerRef,
          {
            username: usernameDisplay,   // Emmy
            username_key: usernameKey,   // emmy
            plan,
            nes: totalNES,
            lastPaymentAmount: amount,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        /* =======================
           7. SUCCESS
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
