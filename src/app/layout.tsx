import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jacaranda School — STEM learning activities",
  description:
    "Explore STEM through physical activities, printable materials and classroom challenges. For Jacaranda School students Grade 6 to Grade 14.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-gradient-to-b from-slate-50 via-teal-50/25 to-slate-100 text-slate-950">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 md:px-8 md:py-14">{children}</main>
      </body>
    </html>
  );
}
