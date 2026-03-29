import { ToastProvider } from "@/components/providers/ToastProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthLayoutWrapper from "./auth-layout-wrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arohoo Marketplace",
  description: "A secure multi-tenant marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <AuthLayoutWrapper>
            {children}
          </AuthLayoutWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
