"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import clsx from "clsx";

const menu = [
  { lable: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, },
  { lable: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r h-screen p-4 space-y-2">
      <h2 className="text-2xl font-bold mb-6">Admin</h2>

      {menu.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
              active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <Icon size={18} />
            {item.lable}
          </Link>
        );
      })}
   </aside>
  );
}
