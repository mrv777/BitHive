import type { AppProps } from "next/app";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BitHive Dashboard",
  description: "Dashboard for managing all your Bitaxe miners",
};

function BitHiveApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} className={inter.className} />
    </Providers>
  );
}

export default BitHiveApp;
