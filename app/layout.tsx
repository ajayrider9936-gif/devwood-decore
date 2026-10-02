import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devwood Dekor — Handcrafted Wooden Furniture",
  description:
    "Premium handcrafted wooden furniture — beds, jhulas, dining sets, wall clocks & décor. Solid wood, hand-finished, delivered across India.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`:root{--font-playfair:'Playfair Display',Georgia,serif;--font-inter:'Inter',system-ui,sans-serif;}`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
