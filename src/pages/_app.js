// pages/_app.js
import "@/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import "video.js/dist/video-js.css";

import NotificationChecker from "../components/NotificationChecker";
import LanguageSelector from "../components/LanguageSelector";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import { translateText } from "../lib/translate";

function TranslatorWrapper({ Component, pageProps }) {
  const { language } = useLanguage();
  const [translatedProps, setTranslatedProps] = useState(pageProps);

  useEffect(() => {
    async function runTranslation() {
      if (language === "EN") {
        setTranslatedProps(pageProps);
        return;
      }

      const newProps = {};
      for (const key in pageProps) {
        if (typeof pageProps[key] === "string") {
          newProps[key] = await translateText(pageProps[key], language);
        } else {
          newProps[key] = pageProps[key];
        }
      }

      setTranslatedProps(newProps);
    }

    runTranslation();
  }, [language, pageProps]);

  return <Component {...translatedProps} />;
}

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <>
        <Head>
          <title>New Talents Stories Group</title>
          <link rel="icon" href="/logo.png" />
        </Head>

        {/* Google AdSense */}
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2059573562083386"
          crossOrigin="anonymous"
        />

        {/* Analytics */}
        <Script
          src="https://shown.io/metrics/Nq92YkDy8W"
          strategy="afterInteractive"
        />

        {/* 🔤 Language selector (igaragara kuri pages zose) */}
        <div style={{ padding: "10px", textAlign: "right" }}>
          <LanguageSelector />
        </div>

        <NotificationChecker />

        <TranslatorWrapper Component={Component} pageProps={pageProps} />
      </>
    </LanguageProvider>
  );
}
