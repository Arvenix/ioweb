import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arvenix ROI Calculator",
  description: "Model operational improvement, EBITDA recovery, and working capital release.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
