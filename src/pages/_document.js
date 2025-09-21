import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* In-Page Push (subtle & friendly) */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="9909707"
          async
          data-cfasync="false"
        ></script>

        {/* Native Banner */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="9909708"
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
