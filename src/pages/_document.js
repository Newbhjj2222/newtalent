import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="rw">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/logo.png" />

        {/* 🟢 Ads Loaders (Placed in head but executed afterInteractive) */}
      </Head>

      <body>
        <Main />
        <NextScript />

        {/* Ads scripts BELOW body to keep SEO clean */}
        
        {/* PropellerAds */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='9915615';
                s.src='https://forfrogadiertor.com/tag.min.js';
              })(document.body.appendChild(document.createElement('script')));
            `,
          }}
        />

        {/* Epic Tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='9915614';
                s.src='https://forfrogadiertor.com/tag.min.js';
              })(document.body.appendChild(document.createElement('script')));
            `,
          }}
        />

        {/* Gizokraijaw */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(s){
                s.dataset.zone='9915679';
                s.src='https://gizokraijaw.net/vignette.min.js';
              })(document.body.appendChild(document.createElement('script')));
            `,
          }}
        />

        {/* Shoukigaigoors */}
        <script
          src="https://shoukigaigoors.net/act/files/tag.min.js?z=9915722"
          async
          data-cfasync="false"
        ></script>
      </body>
    </Html>
  );
}
