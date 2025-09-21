// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon/logo */}
        <link rel="icon" href="/logo.png" />

        {/* Wise Ads - Banner / Push */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="172619"   // Shyiramo ID ya Banner / Push zone yawe
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
