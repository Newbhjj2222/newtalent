// components/LanguageSelector.js
"use client";
import { useEffect } from "react";

export default function LanguageSelector() {
  // Function ifasha guhindura ururimi ukoresheje Google Translate
  const switchLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  };

  // Kora init check kugira ngo dropdown ya Google ibe yiteguye
  useEffect(() => {
    const checkExist = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        clearInterval(checkExist);
      }
    }, 1000);
    return () => clearInterval(checkExist);
  }, []);

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
      <button onClick={() => switchLanguage("en")}>🇬🇧 EN</button>
      <button onClick={() => switchLanguage("rw")}>🇷🇼 RW</button>
      <button onClick={() => switchLanguage("fr")}>🇫🇷 FR</button>
      <button onClick={() => switchLanguage("sw")}>🇰🇪 SW</button>
    </div>
  );
}
