import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { FaCoins } from "react-icons/fa";
import "./NesMine.css"; // ushobora gushyiramo styling ya floating button

const NesMine = ({ username }) => {
  const db = getFirestore();
  const [nesMined, setNesMined] = useState(0); // NES iri kuri mininga
  const [nesTotal, setNesTotal] = useState(0); // NES user asanzwe afite
  const miningInterval = useRef(null);

  // Fungura NES user
  const fetchUserNes = async () => {
    if (!username) return;
    const depositerRef = doc(db, "depositers", username);
    const depositerSnap = await getDoc(depositerRef);
    if (depositerSnap.exists()) {
      setNesTotal(Number(depositerSnap.data().nes) || 0);
    } else {
      // niba user ataraboneka, shobora kumutunga zero
      await updateDoc(depositerRef, { nes: 0 });
      setNesTotal(0);
    }
  };

  useEffect(() => {
    fetchUserNes();
  }, [username]);

  // Function yo kubara NES buri munota
  const startMining = () => {
    if (miningInterval.current) return; // ntukangure interval ebyiri

    miningInterval.current = setInterval(async () => {
      setNesMined((prev) => {
        const next = parseFloat((prev + 0.001).toFixed(3)); // buri 1 second cyangwa minute, 0.001 NES
        if (next >= 1) {
          addNesToUser(next);
          return 0; // subira ku 0
        }
        return next;
      });
    }, 1000); // 1000ms = 1 second, ushobora guhindura 60000 = 1 minute
  };

  // Function yo kongera NES muri depositers
  const addNesToUser = async (amount) => {
    if (!username) return;
    const depositerRef = doc(db, "depositers", username);
    const depositerSnap = await getDoc(depositerRef);
    if (depositerSnap.exists()) {
      const currentNes = Number(depositerSnap.data().nes) || 0;
      await updateDoc(depositerRef, { nes: currentNes + amount });
      setNesTotal(currentNes + amount);
    }
  };

  const handleClick = () => {
    startMining(); // tangira mining igihe akande
  };

  return (
    <div className="nes-mine-button" onClick={handleClick} style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      backgroundColor: "#f0c330",
      color: "#000",
      borderRadius: "50%",
      width: 70,
      height: 70,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      cursor: "pointer",
      zIndex: 1000,
    }}>
      <FaCoins size={24} />
      <span style={{ fontSize: 12, marginTop: 4 }}>
        {nesMined.toFixed(3)}
      </span>
      <span style={{ fontSize: 10 }}>
        ({nesTotal.toFixed(3)})
      </span>
    </div>
  );
};

export default NesMine;
