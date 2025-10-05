// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon/logo */}
        <link rel="icon" href="/logo.png" />

        {/* Wise / PropellerAds - Banner / Push (forfrogadiertor.com - combined) */}
        <Script
          id="forfrogadiertor-zone"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(zones){
                zones.forEach(z => {
                  const s = document.createElement('script');
                  s.dataset.zone = z;
                  s.src = 'https://forfrogadiertor.com/tag.min.js';
                  document.body.appendChild(s);
                });
              })(['9909216']); // One main zone kept active
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
