import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elsa & Co — Virtual Assistant in Bali",
  description:
    "I do the small things well, so you can do the big things great. Bali-based virtual assistant for entrepreneurs and villa owners.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className="grain">{children}</body>
    </html>
  );
}
