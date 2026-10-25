import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { CatalogProvider } from "@/components/CatalogProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mundofutbol.vercel.app"),
  title: "J&A Mundo Fútbol | Tu Pasión, Tu Camiseta — Tienda Virtual",
  description:
    "Tienda virtual de camisetas de fútbol en Colombia: Retro, Mundialistas, Tipo Jugador 1:1, Liga Colombiana, Uniformes para niños y conjuntos polo. Pide fácil por WhatsApp.",
  keywords: [
    "camisetas de futbol",
    "camisetas retro",
    "camisetas 1:1",
    "tipo jugador",
    "liga colombiana",
    "futbol colombia",
    "camisetas baratas",
    "J&A Mundo Futbol",
  ],
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "J&A Mundo Fútbol | Tu Pasión, Tu Camiseta",
    description: "Tienda virtual de camisetas de fútbol: Retro, Mundialistas, 1:1, Liga Colombiana. Pide por WhatsApp.",
    images: [{ url: "/logo.jpg" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F8FAFC] text-slate-900 selection:bg-cyan-500 selection:text-white">
        <CatalogProvider>
          <Suspense fallback={<div className="h-20 bg-[#0B1528]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloat />
        </CatalogProvider>
      </body>
    </html>
  );
}
