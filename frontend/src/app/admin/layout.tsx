"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Users, FolderTree, Landmark, Package } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/merchants", label: "Merchants", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/malls", label: "Malls", icon: Landmark },
  { href: "/admin/products", label: "Global Products", icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <DashboardLayout navItems={ADMIN_NAV_ITEMS} title="Admin Center">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
