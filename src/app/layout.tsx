import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gold Miner MVP",
  description: "Prototype game Đào Vàng built with Next.js + PixiJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
