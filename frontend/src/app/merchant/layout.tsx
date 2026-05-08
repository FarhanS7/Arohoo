"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Package, Ruler, Settings, Truck } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth.context";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname === "/merchant/signup") {
    return <>{children}</>;
  }

  const isFashionMerchant = user?.merchant?.categories?.some(cat => {
    const name = cat.name.toLowerCase();
    return name.includes("fashion") || 
           name.includes("men") || 
           name.includes("women") || 
           name.includes("kids") || 
           name.includes("shoes");
  });

  const navItems = [
    { href: "/merchant", label: "Overview", icon: LayoutDashboard },
    { href: "/merchant/products", label: "My Products", icon: Package },
    ...(isFashionMerchant ? [{ href: "/merchant/size-chart", label: "Size Chart", icon: Ruler }] : []),
    { href: "/merchant/fulfillment", label: "Fulfillment", icon: Truck },
    { href: "/merchant/settings", label: "Store Settings", icon: Settings },
  ];

  return (
    <ProtectedRoute allowedRoles={["MERCHANT"]}>
      <DashboardLayout navItems={navItems} title="Merchant Hub">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
