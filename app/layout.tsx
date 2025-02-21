"use client";
import "./globals.scss";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <CacheProvider value={cacheRtl}>
          <ToastContainer position="top-center" />
          <NextTopLoader showSpinner={false} />
          {children}
        </CacheProvider>
      </body>
    </html>
  );
}
