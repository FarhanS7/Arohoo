import { ToastProvider } from "@/components/providers/ToastProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/features/auth/auth.context";
import { CartProvider } from "@/features/cart/cart.context";
import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} font-sans antialiased bg-surface text-on-surface`}
      >
        <QueryProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
