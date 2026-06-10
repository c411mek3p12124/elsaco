import type { Metadata } from "next";

// Keep the private editor out of search engines.
export const metadata: Metadata = {
  title: "Editor — Elsa & Co",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
