import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import ConsoleFix from "@/components/ConsoleFix";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Agent Quote — Commerce Agents",
  description:
    "AI-powered quotation management for premium digital agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
        data-app="quote"
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          backgroundColor: "#FFFFFF",
          color: "#000000",
        }}
      >
        <ConsoleFix />
        <LoadingScreen />
        {/* Film grain — always-on subtle texture overlay */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 9998,
            opacity: 0.03,
            mixBlendMode: "overlay",
            backgroundImage:
              "url('/noise.svg')",
          }}
        />
        {children}
      </body>
    </html>
  );
}
