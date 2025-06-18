import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Provider from "./Provider";

import { ClerkProvider } from "@clerk/nextjs";

import { IBM_Plex_Sans_Thai } from "next/font/google";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Buriram",
  description: "Dev by Mek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${ibmPlexSansThai.className} antialiased`}
        >
          <Provider>
            <Navbar />

            <main className=" mx-auto">
              {children}
            </main>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
