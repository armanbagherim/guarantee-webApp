"use client";
import "./globals.scss";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";

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
          <Toaster position="top-center" />
          <NextTopLoader showSpinner={false} />
          {children}
        </CacheProvider>
        <Script
          id="muchat-agent"
          type="module"
          dangerouslySetInnerHTML={{
            __html: `import Chatbox from 'https://cdn.mu.chat/embeds/dist/chatbox/index.js?v=2';
             
   Chatbox.initBubble({
   agentId: 'cmaoe6qid00x5vjfme757x5ji',
      });`,
          }}
        />
      </body>
    </html>
  );
}
