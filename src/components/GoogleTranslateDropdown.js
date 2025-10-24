// components/GoogleTranslateDropdown.js
"use client";
import { useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslateDropdown() {
  useEffect(() => {
    // Function itangira Google Translate
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

      // Gusubiza ururimi user yaherukaga guhitamo
      const savedLang = localStorage.getItem("preferredLang");
      if (savedLang) {
        setTimeout(() => {
          const select = document.querySelector(".goog-te-combo");
          if (select) {
            select.value = savedLang;
            select.dispatchEvent(new Event("change"));
          }
        }, 2000);
      }
    };

    // Kureba impinduka zose kuri dropdown
    const observer = new MutationObserver(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
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

      {/* Container ya dropdown */}
      <div id="google_translate_container">
        <div id="google_translate_element"></div>
      </div>
    </>
  );
}
