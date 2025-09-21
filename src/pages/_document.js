import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Native Banner (subtle banner display) */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="9909708"
          async
          data-cfasync="false"
        ></script>

        {/* In-Page Push (user-friendly notifications within page) */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="9909707"
          async
          data-cfasync="false"
        ></script>

        {/* Push Notifications (opt-in notifications) */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="9909710"
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
