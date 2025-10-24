// pages/_app.js
import "@/styles/globals.css";
import Script from "next/script";
import Head from "next/head";
import 'video.js/dist/video-js.css';
import NotificationChecker from "../components/NotificationChecker";

// Import language provider
import { LanguageProvider } from "../components/LanguageProvider";
import LanguageSelector from "../components/LanguageSelector";

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <>
        {/* Title ya website */}
        <Head>
          <title>New Talents Stories Group</title>
          <link rel="icon" href="/logo.png" />
        </Head>

        {/* Google AdSense script global */}
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2059573562083386"
          crossOrigin="anonymous"
        />

        {/* Language Selector (urashobora kuyishyira kuri Navbar cyangwa Footer) */}
        <LanguageSelector />

        {/* Izi component zose zizaba mu rurimi rwahiswemo */}
        <NotificationChecker />
        <Component {...pageProps} />
      </>
    </LanguageProvider>
  );
}
