import { ToastProvider } from "@/components/providers/ToastProvider";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import AuthLayoutWrapper from "./auth-layout-wrapper";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
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
        className={`${openSans.variable} antialiased`}
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
