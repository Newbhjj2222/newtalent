// components/GoogleTranslateDropdown.js
"use client";
import { useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslateDropdown() {
  useEffect(() => {
    // Reba niba function ya GoogleTranslate itarashyirwaho
    window.googleTranslateElementInit = () => {
      if (!document.getElementById("google_translate_element").innerHTML.trim()) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,rw,fr,sw",
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  return (
    <>
      <Script
        id="google-translate-script"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      {/* Aha niho dropdown igaragarira kuri website */}
      <div
        id="google_translate_element"
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 99999,
          background: "rgba(255,255,255,0.85)",
          borderRadius: "8px",
          padding: "6px 8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      ></div>
    </>
  );
}
