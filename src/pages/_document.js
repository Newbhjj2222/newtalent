import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="rw">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/logo.png" />

        {/* Charset igomba kuba hano hejuru cyane */}
        <meta charSet="utf-8" />

        {/* Ibindi byose biguma hano, ariko NTA scripts */}
      </Head>

      <body>
        <Main />
        <NextScript />

        {/* SCRIPT ZOSE ZIJYA HANO - MU BOTTOM YA BODY */}

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

        <script
          src="https://shoukigaigoors.net/act/files/tag.min.js?z=9915722"
          async
        ></script>
      </body>
    </Html>
  );
}
