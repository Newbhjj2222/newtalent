// pages/_app.js
import "@/styles/globals.css";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Google AdSense script global */}
      <Script
        id="adsense-script"
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2059573562083386"
        crossOrigin="anonymous"
      />

      {/* Pages zose zishyirwa hano */}
      <Component {...pageProps} />
    </>
  );
}
