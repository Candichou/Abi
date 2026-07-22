import type { Metadata } from "next";
import "./globals.css";

import { Open_Sans, Raleway } from "next/font/google";
import Header from "@/components/layout/Header";

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
  description: "Annuaire de praticiens de santé validés éthiquement.",
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
        <footer className="mt-auto bg-forest py-3 px-4 text-center text-sm text-cream/60">
          © Abi avec Bienveillance et Inclusion
        </footer>
      </body>
    </html>
  );
}
