// pages/_app.js
import "@/styles/globals.css";
import Script from "next/script";
import Head from "next/head";

// Import language provider
import { LanguageProvider } from "../components/LanguageProvider";

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

        {/* Language selector global (ushobora gushyira kuri navbar) */}
        {/* Example: use in layout or top of each page */}
        {/* <LanguageSelector /> */}

        {/* Pages zose zishyirwa hano */}
        <Component {...pageProps} />
          
      </>
    </LanguageProvider>
  );
    }
