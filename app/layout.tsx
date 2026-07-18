import type { Metadata, Viewport } from "next";
import { Anton, Barlow_Condensed } from "next/font/google";
import { getSiteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const barlow = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "music",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: "Yungas Rock | La selva también hace ruido",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Yungas Rock | La selva también hace ruido",
    description: siteConfig.description,
  },
  icons: {
    icon: "/yungas-rock-logo.jpg",
    apple: "/yungas-rock-logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ff6b00",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <body className={`${anton.variable} ${barlow.variable}`}>{children}</body>
    </html>
  );
}
