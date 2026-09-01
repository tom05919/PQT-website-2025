import type { Metadata } from "next";
import "../styles/index.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Princeton Quantitative Traders",
  description:
    "Princeton University's quantitative trading club, with weekly project and interview-preparation sessions.",
  icons: {
    icon: '/images/logo-no-text.png',
    shortcut: '/images/logo-no-text.png',
    apple: '/images/logo-no-text.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
