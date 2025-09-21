import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon/logo */}
        <link rel="icon" href="/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* PropellerAds script */}
        <Script id="propellerads" strategy="afterInteractive">
          {`(function(s){
              s.dataset.zone='9909216';
              s.src='https://forfrogadiertor.com/tag.min.js'
          })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
        </Script>
      </body>
    </Html>
  );
}
