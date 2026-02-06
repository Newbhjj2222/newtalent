// pages/_app.js
import "@/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import "video.js/dist/video-js.css";

import NotificationChecker from "../components/NotificationChecker";

export default function App({ Component, pageProps }) {
  return (
    <>
       <Head>
        {/* Title (default) */}
        <title>
          New Talents Stories Group | Inkuru rwanda, Inkuru zigezweho, Inkuru z'urukundo, Inkuru zabantu bakuru, inkuru nshya
        </title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Soma inkuru nyarwanda, inkuru z'urukundo, drama, fiction n'ibitabo online byanditswe n'abanditsi batandukanye bo muri Africa no ku isi hose. New Talents Stories Group ni isomero ryo kuri internet ritanga inkuru nshya buri munsi."
        />

        {/* Keywords */}
        <meta
          name="keywords"
          content="inkuru nyarwanda, inkuru z'urukundo, inkuru za drama, fiction stories, ibitabo online, African writers, isomero online"
        />

        {/* Canonical */}
        <link rel="canonical" href="https://www.newtalentsg.co.rw" />

        {/* Favicon */}
        <link rel="icon" href="/logo.png" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="New Talents Stories Group | Inkuru Nyarwanda"
        />
        <meta
          property="og:description"
          content="Soma inkuru nyarwanda n'izindi nkuru zanditswe n'abanditsi bo muri Africa no ku isi hose."
        />
        <meta property="og:url" content="https://www.newtalentsg.co.rw" />
        <meta
          property="og:image"
          content="https://www.newtalentsg.co.rw/logo.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="New Talents Stories Group"
        />
        <meta
          name="twitter:description"
          content="Inkuru nyarwanda, drama, fiction n'ibitabo online. Inkuru nshya buri munsi."
        />
        <meta
          name="twitter:image"
          content="https://www.newtalentsg.co.rw/logo.png"
        />

        {/* Mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

      <NotificationChecker />

      <Component {...pageProps} />
    </>
  );
}
