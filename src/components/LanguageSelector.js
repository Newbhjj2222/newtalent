// components/LanguageSelector.js
"use client";
import { useEffect, useState } from "react";

export default function LanguageSelector() {
  const [ready, setReady] = useState(false);

  // Reba niba combo ya Google Translate iriho
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.querySelector(".goog-te-combo")) {
        setReady(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const switchLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    } else {
      alert("Please wait a second, translation system is loading...");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        zIndex: 99999,
        display: "flex",
        gap: "8px",
        background: "rgba(255,255,255,0.85)",
        borderRadius: "8px",
        padding: "6px 10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <button disabled={!ready} onClick={() => switchLanguage("en")}>🇬🇧 EN</button>
      <button disabled={!ready} onClick={() => switchLanguage("rw")}>🇷🇼 RW</button>
      <button disabled={!ready} onClick={() => switchLanguage("fr")}>🇫🇷 FR</button>
      <button disabled={!ready} onClick={() => switchLanguage("sw")}>🇰🇪 SW</button>
    </div>
  );
}
