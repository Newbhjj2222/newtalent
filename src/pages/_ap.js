// pages/_app.js

import Script from "next/script";
import Head from "next/head";
import 'video.js/dist/video-js.css';
import NotificationChecker from "../components/NotificationChecker";
export default function App({ Component, pageProps }) {
  return (
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
          <script defer src="https://shown.io/metrics/Nq92YkDy8W" type="text/javascript"></script>

      {/* Dropdown ya Google Translate (igaragara kuri pages zose) */}
      

      <NotificationChecker />
      <Component {...pageProps} />
    </>
  );
}
