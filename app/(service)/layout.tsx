"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth-client";

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await fetchWithAuth("/api/wallet/balance");
        const data = await response.json();
        if (data.success) {
          setBalance(data.data.balance);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Active class helpers
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const topNavClass = (href: string) =>
    isActive(href)
      ? "text-primary text-sm font-bold transition-colors"
      : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors";

  const sidebarClass = (href: string) =>
    isActive(href)
      ? "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold transition-colors"
      : "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 dark:hover:text-white font-medium transition-colors";

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col">
      {/* Top Navigation - Fixed */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-[#2c2839] px-6 lg:px-10 py-4 bg-white dark:bg-background-dark fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
              <path clipRule="evenodd" d="M29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillOpacity="0.5" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
            Accthive
          </h2>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link className={topNavClass("/social-boost")} href="/social-boost">
              Social Boost
            </Link>
            <Link className={topNavClass("/social-accounts")} href="/social-accounts">
              Social Accounts
            </Link>
            <Link className={topNavClass("/sms-service")} href="/sms-service">
              SMS Service
            </Link>
            <Link className={topNavClass("/gifting")} href="/gifting">
              Global Gifting
            </Link>
          </nav>
          <div className="flex gap-3">
            <Link
              href="/wallet"
              className="flex items-center gap-2 cursor-pointer bg-primary hover:bg-primary/90 transition-colors text-white rounded-full h-10 px-5 text-sm font-bold shadow-lg shadow-primary/25"
            >
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              <span>{loading ? "..." : `$${balance.toFixed(2)}`}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center cursor-pointer bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#413b54] transition-colors text-gray-900 dark:text-white rounded-full size-10"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-gray-900 dark:text-white"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex w-full flex-1 pt-[73px]">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden top-[73px]"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed top-[73px] w-64 h-[calc(100vh-73px)] border-r border-gray-200 dark:border-[#2c2839] bg-white dark:bg-background-dark overflow-y-auto z-40 flex flex-col transition-all duration-300 ${
          mobileMenuOpen ? "left-0" : "-left-64 lg:left-0"
        }`}>
          <div className="flex flex-col gap-1 p-4">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={sidebarClass("/dashboard")}>
              <span className="material-symbols-outlined">grid_view</span>
              <span>Dashboard</span>
            </Link>
            <Link href="/social-boost" onClick={() => setMobileMenuOpen(false)} className={sidebarClass("/social-boost")}>
              <span className="material-symbols-outlined">trending_up</span>
              <span>Social Boost</span>
            </Link>
            <Link href="/social-accounts" onClick={() => setMobileMenuOpen(false)} className={sidebarClass("/social-accounts")}>
              <span className="material-symbols-outlined">account_circle</span>
              <span>Social Accounts</span>
            </Link>
            <Link href="/sms-service" onClick={() => setMobileMenuOpen(false)} className={sidebarClass("/sms-service")}>
              <span className="material-symbols-outlined">sms</span>
              <span>SMS Service</span>
            </Link>
            <Link href="/gifting" onClick={() => setMobileMenuOpen(false)} className={sidebarClass("/gifting")}>
              <span className="material-symbols-outlined">card_giftcard</span>
              <span>Global Gifting</span>
            </Link>
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className={sidebarClass("/profile")}>
              <span className="material-symbols-outlined">person</span>
              <span>User Profile</span>
            </Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)} className={sidebarClass("#")}>
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-hidden lg:ml-64">{children}</main>
      </div>
    </div>
  );
}
