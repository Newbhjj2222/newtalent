import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, updateDoc, onSnapshot, setDoc } from "firebase/firestore";
import { FaCoins } from "react-icons/fa";
import "./NesMine.css";

const NesMine = ({ username }) => {
  const db = getFirestore();
  const [nesMined, setNesMined] = useState(0); // NES iri kuri mining
  const [nesTotal, setNesTotal] = useState(0); // NES user afite muri database
  const miningInterval = useRef(null);

  useEffect(() => {
    if (!username) return;

    const depositerRef = doc(db, "depositers", username);

    // Subscribe to changes in real-time
    const unsubscribe = onSnapshot(depositerRef, async (snap) => {
      if (snap.exists()) {
        setNesTotal(Number(snap.data().nes) || 0);
      } else {
        // If user doesn't exist, create document with nes=0
        await setDoc(depositerRef, { nes: 0 });
        setNesTotal(0);
      }
    });

    return () => unsubscribe(); // cleanup on unmount or username change
  }, [username, db]);

  // Start mining
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
    }, 1000); // buri 1 second
  };

  // Add mined NES to user in database
  const addNesToUser = async (amount) => {
    if (!username) return;
    const depositerRef = doc(db, "depositers", username);
    const currentSnap = await depositerRef.get?.() || await import('firebase/firestore').then(f => f.getDoc(depositerRef));
    const currentNes = currentSnap.exists() ? Number(currentSnap.data().nes || 0) : 0;
    await updateDoc(depositerRef, { nes: currentNes + amount });
    // setNesTotal izakorwa na onSnapshot automatically
  };

  const handleClick = () => startMining();

  return (
    <div
      className="nes-mine-button"
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 20,
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

export default NesMine;
