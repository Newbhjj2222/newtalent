// components/NesMineSSR.js
import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, updateDoc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { FaCoins } from "react-icons/fa";
import { db } from "./firebase";

const NesMineSSR = ({ username, initialNesTotal }) => {
  const db = getFirestore(firebaseApp);
  const [nesMined, setNesMined] = useState(0);       // Local mining counter
  const [nesTotal, setNesTotal] = useState(initialNesTotal || 0); // Server-side fetched NES
  const miningInterval = useRef(null);

  // Load nesMined from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`nesMined_${username}`);
    if (saved) setNesMined(parseFloat(saved));
  }, [username]);

  // Save nesMined to localStorage
  useEffect(() => {
    if (username) localStorage.setItem(`nesMined_${username}`, nesMined);
  }, [nesMined, username]);

  // Listen to nesTotal updates in Firestore
  useEffect(() => {
    if (!username) return;

    const depositerRef = doc(db, "depositers", username);
    const unsubscribe = onSnapshot(depositerRef, async (snap) => {
      if (snap.exists()) setNesTotal(Number(snap.data().nes) || 0);
      else {
        await setDoc(depositerRef, { nes: 0 });
        setNesTotal(0);
      }
    });

    return () => unsubscribe();
  }, [username, db]);

  // Mining logic
  const startMining = () => {
    if (miningInterval.current) return;
    miningInterval.current = setInterval(async () => {
      setNesMined((prev) => {
        const next = parseFloat((prev + 0.001).toFixed(3));
        if (next >= 1) {
          addNesToUser(next);
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  // Add mined NES to user in Firestore
  const addNesToUser = async (amount) => {
    if (!username) return;
    const depositerRef = doc(db, "depositers", username);
    const currentSnap = await getDoc(depositerRef);
    const currentNes = currentSnap.exists() ? Number(currentSnap.data().nes || 0) : 0;
    await updateDoc(depositerRef, { nes: currentNes + amount });
    localStorage.setItem(`nesMined_${username}`, 0);
  };

  const handleClick = () => startMining();

  return (
    <div
      className="nes-mine-button"
      onClick={handleClick}
      style={{
        position: "fixed",
        top: 90,
        right: 20,
        backgroundColor: "#f0c330",
        color: "#000",
        borderRadius: "50%",
        width: 60,
        height: 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      <FaCoins size={24} />
      <span style={{ fontSize: 12, marginTop: 4 }}>{nesMined.toFixed(3)}</span>
      <span style={{ fontSize: 10 }}>({nesTotal.toFixed(3)})</span>
    </div>
  );
};

export default NesMineSSR;

// Optional: Fetch initial NES total server-side in Next.js page
export async function getServerSideProps(context) {
  const username = context.query.username || null;
  let nesTotal = 0;

  if (username) {
    const db = getFirestore(firebaseApp);
    const depositerRef = doc(db, "depositers", username);
    const snap = await getDoc(depositerRef);
    if (snap.exists()) nesTotal = Number(snap.data().nes || 0);
  }

  return { props: { username, initialNesTotal: nesTotal } };
}
