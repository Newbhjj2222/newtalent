import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon/logo */}
        <link rel="icon" href="/logo.png" />

        {/* Google AdSense script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2059573562083386"
          crossOrigin="anonymous"
        ></script>
            <script>(function(s){s.dataset.zone='9909216',s.src='https://forfrogadiertor.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
