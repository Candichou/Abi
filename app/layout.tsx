import type { Metadata } from "next";
import "./globals.css";

import { Open_Sans, Raleway } from "next/font/google";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Abi, Trouve ton praticien bienveillant",
  description: "Annuaire de praticiens de santé validé.e.s éthiquement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${raleway.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-forest">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
