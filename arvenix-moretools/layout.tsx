import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arvenix Operations Tools",
  description: "Interactive operations calculators and visualizers for inventory and purchasing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
