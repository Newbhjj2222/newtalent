// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon/logo */}
        <link rel="icon" href="/logo.png" />

        {/* PropellerAds Global Tag */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="172619"           // Shyiramo ID yawe ya Push / Banner zone
          async
          data-cfasync="false"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
    }
