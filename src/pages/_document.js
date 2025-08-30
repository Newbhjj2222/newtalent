import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon/logo */}
        <link rel="icon" href="/logo.png" />
        {/* Title y'urubuga */}
        <title>New Talents Stories Group</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
