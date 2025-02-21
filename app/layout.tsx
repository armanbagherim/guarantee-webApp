"use client";
import "./globals.scss";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { ToastContainer } from "react-toastify";

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
    <html lang="en" dir="rtl">
      <body>
        <CacheProvider value={cacheRtl}>
          <ToastContainer position="top-center" />
          {children}
        </CacheProvider>
      </body>
    </html>
  );
}
