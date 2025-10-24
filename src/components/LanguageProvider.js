// components/LanguageProvider.js
"use client";
import Script from "next/script";
import { createContext, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  useEffect(() => {
    // Tangira function ya Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,rw,fr,sw",
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );

      // Fata system language
      const userLang = navigator.language.split("-")[0];
      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          select.value = userLang;
          select.dispatchEvent(new Event("change"));
        }
      }, 2000);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{}}>
      {/* Shyiramo script ya Google Translate */}
      <Script
        id="google-translate-script"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div id="google_translate_element" style={{ display: "none" }}></div>
      {children}
    </LanguageContext.Provider>
  );
};
