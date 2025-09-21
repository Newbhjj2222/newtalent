// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo.png" />

        {/* Wise / PropellerAds - Banner / Push */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){
              s.dataset.zone='9909216',
              s.src='https://forfrogadiertor.com/tag.min.js'
            })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
