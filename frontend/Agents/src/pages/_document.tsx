import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/icons/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
        <meta name="theme-color" content="#ffffff" />

        {/* It’s not recommended to include <title> in _document, but we’ll keep it if needed */}
        <title>A&A Homes - Creating an environment that nurtures</title>
      </Head>

      <body>
        {/* Main app content */}
        <Main />
        <NextScript />

        {/* ✅ Added portal root for modals, datepickers, etc. */}
        <div id="root-portal"></div>

        {/* ✅ Optional fallback for React Portals (like React DatePicker, modals, etc.) */}
        <div id="modal-root"></div>
      </body>
    </Html>
  );
}
