"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/auth-client";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    balance: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch wallet balance
        const balanceRes = await fetchWithAuth("/api/wallet/balance");
        const balanceData = await balanceRes.json();

        // Fetch orders
        const ordersRes = await fetchWithAuth("/api/orders");
        const ordersData = await ordersRes.json();

        if (balanceData.success && ordersData.success) {
          const orders = ordersData.data.orders || [];
          setStats({
            balance: balanceData.data.balance,
            totalOrders: orders.length,
            pendingOrders: orders.filter(
              (o: any) => o.status === "PENDING" || o.status === "PROCESSING",
            ).length,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
            <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
            <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's your account overview
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/wallet"
          className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-4xl">
              account_balance_wallet
            </span>
            <span className="text-sm font-bold uppercase tracking-wider opacity-90">
              Wallet Balance
            </span>
          </div>
          <p className="text-4xl font-bold">${stats.balance.toFixed(2)}</p>
        </Link>

        <Link
          href="/orders"
          className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] hover:border-primary/30 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-4xl">
              shopping_bag
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Total Orders
            </span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {stats.totalOrders}
          </p>
        </Link>

        <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-blue-500 text-4xl">
              pending
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Pending
            </span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {stats.pendingOrders}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/social-boost"
            className="p-4 rounded-xl bg-gray-50 dark:bg-[#181620] hover:bg-gray-100 dark:hover:bg-[#1f1c2a] transition-colors flex items-center gap-4 group"
          >
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">
                trending_up
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                Browse Services
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Explore our service catalog
              </p>
            </div>
          </Link>

          <Link
            href="/wallet"
            className="p-4 rounded-xl bg-gray-50 dark:bg-[#181620] hover:bg-gray-100 dark:hover:bg-[#1f1c2a] transition-colors flex items-center gap-4 group"
          >
            <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-green-500">
                add_circle
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                Add Funds
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Deposit to your wallet
              </p>
            </div>
          </Link>

          <Link
            href="/orders"
            className="p-4 rounded-xl bg-gray-50 dark:bg-[#181620] hover:bg-gray-100 dark:hover:bg-[#1f1c2a] transition-colors flex items-center gap-4 group"
          >
            <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-blue-500">
                receipt_long
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                View Orders
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check your order history
              </p>
            </div>
          </Link>

          <Link
            href="/profile"
            className="p-4 rounded-xl bg-gray-50 dark:bg-[#181620] hover:bg-gray-100 dark:hover:bg-[#1f1c2a] transition-colors flex items-center gap-4 group"
          >
            <div className="size-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-purple-500">
                person
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                My Profile
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
