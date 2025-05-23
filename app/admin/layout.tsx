"use client";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "react-hot-toast/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
import { Provider, atom } from "jotai";
import NextTopLoader from "nextjs-toploader";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import RouteGuard from "./RouteGuard";

interface IPageTitle {
  title: string;
  link: string | null;
  buttonTitle: void;
  onClick: void;
}

export const pageTitle = atom({
  title: "داشبورد",
  link: null,
  buttonTitle: null,
  onClick: null,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });


  return (
    <Provider initialValues={pageTitle}>
      <CacheProvider value={cacheRtl}>
        <html lang="fa" dir="rtl">
          <head></head>
          <body>
            <QueryClientProvider client={queryClient}>
              <Toaster position="bottom-right" />
              <SessionProvider>
                <NextTopLoader />
                <RouteGuard>{children}</RouteGuard>
              </SessionProvider>
            </QueryClientProvider>
          </body>
        </html>
      </CacheProvider>
    </Provider>
  );
}
