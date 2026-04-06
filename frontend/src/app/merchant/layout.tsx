"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Package, ShoppingBag, Settings, Truck } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";

const MERCHANT_NAV_ITEMS = [
  { href: "/merchant", label: "Overview", icon: LayoutDashboard },
  { href: "/merchant/products", label: "My Products", icon: Package },
  { href: "/merchant/fulfillment", label: "Fulfillment", icon: Truck },
  { href: "/merchant/settings", label: "Store Settings", icon: Settings },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["MERCHANT"]}>
      <DashboardLayout navItems={MERCHANT_NAV_ITEMS} title="Merchant Hub">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
