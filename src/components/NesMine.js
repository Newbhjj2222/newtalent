import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, updateDoc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { FaCoins } from "react-icons/fa";
import "./NesMine.css";

const NesMine = ({ username }) => {
  const db = getFirestore();
  const [nesMined, setNesMined] = useState(0); // NES iri kuri mining (local only)
  const [nesTotal, setNesTotal] = useState(0); // NES user afite muri database
  const miningInterval = useRef(null);

  // ---->> Load nesMined ifari muri localStorage igihe component ifunguye
  useEffect(() => {
    const saved = localStorage.getItem(`nesMined_${username}`);
    if (saved) {
      setNesMined(parseFloat(saved));
    }
  }, [username]);

  // ---->> Bika buri gihe nesMined muri localStorage igihe ihindutse
  useEffect(() => {
    if (username) {
      localStorage.setItem(`nesMined_${username}`, nesMined);
    }
  }, [nesMined, username]);

  // ---->> Listen ku nesTotal muri database
  useEffect(() => {
    if (!username) return;

    const depositerRef = doc(db, "depositers", username);

    const unsubscribe = onSnapshot(depositerRef, async (snap) => {
      if (snap.exists()) {
        setNesTotal(Number(snap.data().nes) || 0);
      } else {
        await setDoc(depositerRef, { nes: 0 });
        setNesTotal(0);
      }
    });

    return () => unsubscribe();
  }, [username, db]);

  // ---->> Start mining
  const startMining = () => {
    if (miningInterval.current) return;

    miningInterval.current = setInterval(async () => {
      setNesMined((prev) => {
        const next = parseFloat((prev + 0.001).toFixed(3));
        if (next >= 1) {
          addNesToUser(next);
          return 0; // reset local counter
        }
        return next;
      });
    }, 1000);
  };

  // ---->> Add mined NES muri database
  const addNesToUser = async (amount) => {
    if (!username) return;
    const depositerRef = doc(db, "depositers", username);
    const currentSnap = await getDoc(depositerRef);
    const currentNes = currentSnap.exists() ? Number(currentSnap.data().nes || 0) : 0;
    await updateDoc(depositerRef, { nes: currentNes + amount });

    // localStorage reset -> kuko nesMined yabaye 0
    localStorage.setItem(`nesMined_${username}`, 0);
  };

  // ---->> User niyongera gukanda ho ni bwo mining isubukurwa
  const handleClick = () => startMining();

  return (
    <div
      className="nes-mine-button"
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: darkMode ? "#444" : "#eee",
        color: darkMode ? "#fff" : "#000",
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
