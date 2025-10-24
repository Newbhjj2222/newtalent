// components/GoogleTranslateDropdown.js
"use client";
import { useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslateDropdown() {
  useEffect(() => {
    // Function ya Google Translate initialization
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

      // Tugerageze gushyiraho ururimi rw'ibanze
      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          // Reba niba user afite ururimi muri localStorage
          const savedLang = localStorage.getItem("preferredLang");

          if (savedLang) {
            select.value = savedLang;
            select.dispatchEvent(new Event("change"));
          } else {
            // Niba ntarwo afite, fata ururimi rwa browser
            const browserLang = navigator.language.split("-")[0];
            const availableLangs = ["en", "rw", "fr", "sw"];
            const chosenLang = availableLangs.includes(browserLang)
              ? browserLang
              : "en"; // fallback kuri English

            select.value = chosenLang;
            select.dispatchEvent(new Event("change"));
            localStorage.setItem("preferredLang", chosenLang);
          }
        }
      }, 2000);
    };

    // Kureba impinduka kuri dropdown kugira ngo tubike ururimi rushya
    const observer = new MutationObserver(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select && !select.dataset.listenerAttached) {
        select.dataset.listenerAttached = "true";
        select.addEventListener("change", (e) => {
          const lang = e.target.value;
          if (lang) {
            localStorage.setItem("preferredLang", lang);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Google Translate Script */}
      <Script
        id="google-translate-script"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      {/* Dropdown container */}
      <div id="google_translate_container">
        <div id="google_translate_element"></div>
      </div>
    </>
  );
}
