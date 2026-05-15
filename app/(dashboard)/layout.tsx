"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navClass = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")
      ? "flex items-center gap-3 px-4 py-3 rounded-full bg-primary text-white shadow-lg shadow-primary/25"
      : "flex items-center gap-3 px-4 py-3 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group";

  const iconClass = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")
      ? "material-symbols-outlined"
      : "material-symbols-outlined group-hover:text-primary transition-colors";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased flex min-h-screen w-full">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 text-gray-900 dark:text-white"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <aside className={`fixed top-0 w-72 h-screen border-r border-gray-200 dark:border-border-dark bg-white dark:bg-background-dark p-6 justify-between flex-shrink-0 z-40 flex flex-col transition-all duration-300 ${
        mobileMenuOpen ? "left-0" : "-left-72 lg:left-0"
      }`}>
        <div className="flex flex-col gap-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-3xl">
                hexagon
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold leading-none tracking-tight">
                Accthive
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Digital Platform
              </p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-2">
            <Link
              className={navClass("/dashboard")}
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className={iconClass("/dashboard")}>dashboard</span>
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              className={navClass("/wallet")}
              href="/wallet"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className={iconClass("/wallet")}>account_balance_wallet</span>
              <span className="font-medium">Wallet</span>
            </Link>
            <Link
              className={navClass("/orders")}
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className={iconClass("/orders")}>shopping_bag</span>
              <span className="font-medium">Orders</span>
            </Link>
            <Link
              className={navClass("/social-boost")}
              href="/social-boost"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className={iconClass("/social-boost")}>grid_view</span>
              <span className="font-medium">Services</span>
            </Link>
            <Link
              className={navClass("/profile")}
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className={iconClass("/profile")}>settings</span>
              <span className="font-medium">Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Brief */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
          <div
            className="h-10 w-10 rounded-full bg-cover bg-center"
            data-alt="User profile avatar showing a smiling person"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZ-f1gNI1wQbybUHjhTXtv6Teq42UWsyY-vdRMobHY2vfe5e0sFN9sBjRSw4AZaqMKCk7V7ADb8v5hX7RuZe624huUoH8CZvBVom1h1P60UFWDneZlm-6EdpgND_ATnyajuPxGKUECPj71CAtwv9niCpfnvIameBiNNE_O0vZcN6aW6gWD35_98iJnjfZBlO0-nZMxJV_K6VYzq_u3V5jHBBNgq9wyCcwWmbDWBx3EWYIlqt1L76J_WMVj4bnFFyqgkJXv5k1IPd8')",
            }}
          ></div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-bold truncate">Alex Morgan</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Pro Member
            </p>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-72 w-full">{children}</div>
    </div>
  );
}
