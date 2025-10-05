'use client';

import React, { useState, useEffect, useRef } from "react";
import { doc, updateDoc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { FaCoins } from "react-icons/fa";
import { db } from "./firebase";

const NesMineSSR = ({ username, initialNesTotal }) => {
  const [nesTotal, setNesTotal] = useState(initialNesTotal || 0);
  const [userPlan, setUserPlan] = useState(null);
  const [canMine, setCanMine] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const miningInterval = useRef(null);

  // Listen for updates (NES + plan)
  useEffect(() => {
    if (!username) return;

    const depositerRef = doc(db, "depositers", username);
    const unsubscribe = onSnapshot(depositerRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setNesTotal(Number(data.nes) || 0);
        setUserPlan(data.plan || "free");
      } else {
        await setDoc(depositerRef, { nes: 0, plan: "free" });
        setNesTotal(0);
        setUserPlan("free");
      }
    });

    return () => unsubscribe();
  }, [username]);

  // Eligibility check
  useEffect(() => {
    const allowed = (userPlan === "bestreader") && nesTotal > 5;
    setCanMine(allowed);
  }, [userPlan, nesTotal]);

  // Add mined NES (whole number only)
  const addNesToUser = async (amount = 1) => {
    if (!username) return;
    const depositerRef = doc(db, "depositers", username);
    const snap = await getDoc(depositerRef);
    const current = snap.exists() ? Math.floor(Number(snap.data().nes) || 0) : 0;
    const newTotal = current + amount;
    await updateDoc(depositerRef, { nes: newTotal });
    setNesTotal(newTotal);
  };

  // Start mining logic
  const startMining = async () => {
    if (!canMine) {
      alert("⚠️ Ngura full plan y’ukwezi yi 1200 rwf kugira ngo wemererwe ku mininga 💳");
      return;
    }

    if (isMining || miningInterval.current) return;

    setIsMining(true);

    miningInterval.current = setInterval(async () => {
      await addNesToUser(1); // increase NES by 1
    }, 5000); // buri masegonda 5
  };

  // Stop mining when user leaves or component unmounts
  useEffect(() => {
    return () => {
      if (miningInterval.current) clearInterval(miningInterval.current);
    };
  }, []);

  const handleClick = () => {
    if (isMining) {
      clearInterval(miningInterval.current);
      miningInterval.current = null;
      setIsMining(false);
    } else {
      startMining();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 120,
        right: 20,
        backgroundColor: canMine ? (isMining ? "#00b341" : "#f0c330") : "#999",
        color: "#000",
        borderRadius: "50%",
        width: 70,
        height: 70,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        cursor: canMine ? "pointer" : "not-allowed",
        zIndex: 1000,
        opacity: canMine ? 1 : 0.6,
        transition: "all 0.3s ease-in-out",
      }}
      title={
        canMine
          ? isMining
            ? "Mining irimo gukora..."
            : "Kanda utangire mining"
          : "Ugomba kugura plan y’ukwezi kugira ngo wemererwe ku mininga"
      }
    >
      <FaCoins size={26} />
      <span style={{ fontSize: 12, marginTop: 4, fontWeight: "bold" }}>
        {Math.floor(nesTotal)}
      </span>
      <span style={{ fontSize: 10 }}>
        {canMine ? (isMining ? "Mining..." : "Ready") : "Not allowed"}
      </span>
    </div>
  );
};

export default NesMineSSR;

// Optional: server-side fetch initial NES
export async function getServerSideProps(context) {
  const username = context.query.username || null;
  let nesTotal = 0;

  if (username) {
    const depositerRef = doc(db, "depositers", username);
    const snap = await getDoc(depositerRef);
    if (snap.exists()) nesTotal = Math.floor(Number(snap.data().nes || 0));
  }

  return { props: { username, initialNesTotal: nesTotal } };
}
