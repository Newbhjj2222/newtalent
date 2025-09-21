// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon/logo */}
        <link rel="icon" href="/logo.png" />

        {/* PropellerAds Global Tag */}
        
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
    }
