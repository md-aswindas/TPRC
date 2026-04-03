import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TP Raju Engineering Landing Page",
  description:
    "Premium scaffolding and industrial engineering services — TP Raju Engineering Contractor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`font-display bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-100 antialiased transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
