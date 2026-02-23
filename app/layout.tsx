import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.SITE_URL || "https://example.com";

export const metadata: Metadata = {
  title: {
    template: "%s | ktsu2i.dev",
    default: "ktsu2i.dev",
  },
  description: "ktsu2i のブログ & ポートフォリオサイト",
  openGraph: {
    title: "ktsu2i.dev",
    description: "ktsu2i のブログ & ポートフォリオサイト",
    url: siteUrl,
    siteName: "ktsu2i.dev",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ktsu2i.dev",
    description: "ktsu2i のブログ & ポートフォリオサイト",
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="mx-auto min-h-screen max-w-4xl px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
