"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Menu, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

const menu = [
  { lable: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { lable: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed md:sticky top-0 left-0 z-40 h-screen bg-white border-r transition-transform duration-300 w-64 p-4 space-y-2",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <h2 className="text-2xl font-bold mb-6 pt-10 md:pt-0">Admin</h2>
        {menu.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)} 
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <Icon size={18} /> {item.lable}
            </Link>
          );
        })}
      </aside>
    </>
  );
}
