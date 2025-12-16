// pages/pay.js
'use client';

import { useEffect, useState } from "react";
import { db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Pay() {
  const [username, setUsername] = useState(null);
  const [nes, setNes] = useState(0);

  useEffect(() => {
    // Soma username muri localStorage
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) return; // ushobora na redirect kuri login niba ushaka
    setUsername(storedUsername);

    // Soma NES muri Firestore
    const fetchNES = async () => {
      const depositerRef = doc(db, "depositers", storedUsername);
      const docSnap = await getDoc(depositerRef);
      if (docSnap.exists()) {
        setNes(docSnap.data().nes || 0);
      } else {
        setNes(0);
      }
    };
    fetchNES();
  }, []);

  const handlePurchase = () => {
    window.location.href = "https://payj.gamer.gd/";
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  };

  const cardStyle = {
    maxWidth: "500px",
    width: "100%",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    padding: "30px",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "1.8rem",
    marginBottom: "15px",
    color: "#333",
  };

  const nesStyle = {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#0070f3",
    marginTop: "20px",
  };

  const buttonStyle = {
    marginTop: "25px",
    padding: "12px 25px",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#0070f3",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#005bb5",
  };

  if (!username) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Injira mbere yo gukomeza</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Your NeS Balance</h1>
          <p style={nesStyle}>{nes} NeS Points</p>

          <button
            style={buttonStyle}
            onClick={handlePurchase}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
          >
            Gura NeS
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
    }
