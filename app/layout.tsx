import type { Metadata } from "next";
import { Anton, Barlow_Condensed } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Yungas Rock | La selva también hace ruido",
  description:
    "Eventos, bandas, entradas y convocatorias de Yungas Rock en Jujuy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${anton.variable} ${barlow.variable}`}>{children}</body>
    </html>
  );
}
