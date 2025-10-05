// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon/logo */}
        <link rel="icon" href="/logo.png" />

        {/* Wise / PropellerAds - Banner / Push */}
        <Script
          id="zone-9909216"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='9909216';
                s.src='https://forfrogadiertor.com/tag.min.js';
              })(document.body.appendChild(document.createElement('script')));
            `,
          }}
        />
        <Script
          id="zone-9910308"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='9910308';
                s.src='https://forfrogadiertor.com/tag.min.js';
              })(document.body.appendChild(document.createElement('script')));
            `,
          }}
        />
        <Script
          id="zone-9915615"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='9915615';
                s.src='https://forfrogadiertor.com/tag.min.js';
              })(document.body.appendChild(document.createElement('script')));
            `,
          }}
        />

        {/* Epic tag Push Notifications - 9915614 */}
        <Script
          id="zone-9915614"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='9915614';
                s.src='https://forfrogadiertor.com/tag.min.js';
              })(document.body.appendChild(document.createElement('script')));
            `,
          }}
        />

        {/* Gizokraijaw Push - 9915679 */}
        <Script
          id="zone-9915679"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='9915679';
                s.src='https://gizokraijaw.net/vignette.min.js';
              })(document.body.appendChild(document.createElement('script')));
            `,
          }}
        />

        {/* Shoukigaigoors Push - 9915722 */}
        <Script
          src="https://shoukigaigoors.net/act/files/tag.min.js?z=9915722"
          strategy="afterInteractive"
          async
          data-cfasync="false"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
