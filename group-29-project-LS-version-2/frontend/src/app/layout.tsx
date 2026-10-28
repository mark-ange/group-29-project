import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const appUrl = process.env.APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: { default: "StayNest — Thoughtful stays, beautifully found", template: "%s | StayNest" },
  description: "Find distinctive places to stay, selected for a more considered escape.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "StayNest — Thoughtful stays, beautifully found",
    description: "Find distinctive places to stay, selected for a more considered escape.",
    url: appUrl,
    siteName: "StayNest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body><MotionProvider>{children}<SiteFooter /></MotionProvider></body>
    </html>
  );
}
