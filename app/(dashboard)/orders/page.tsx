"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth-client";
import Link from "next/link";

interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  status: string;
  createdAt: string;
}

import { Suspense } from "react";

function OrdersContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(success === "true");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetchWithAuth("/api/orders");
        const data = await response.json();

        if (data.success) {
          setOrders(data.data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();

    // Hide success message after 5 seconds
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 text-green-500";
      case "PROCESSING":
        return "bg-blue-500/10 text-blue-500";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500";
      case "FAILED":
        return "bg-red-500/10 text-red-500";
      case "CANCELLED":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
          <div className="h-64 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-green-500 text-2xl">
            check_circle
          </span>
          <div className="flex-1">
            <p className="text-green-500 font-bold">
              Order Placed Successfully!
            </p>
            <p className="text-green-500/80 text-sm">
              Your order has been confirmed and is being processed.
            </p>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-green-500 hover:text-green-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Orders
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View and manage your order history
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">
              shopping_bag
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase">
              Total Orders
            </span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {orders.length}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-green-500 text-3xl">
              check_circle
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase">
              Completed
            </span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {orders.filter((o) => o.status === "COMPLETED").length}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-blue-500 text-3xl">
              pending
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase">
              Processing
            </span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {
              orders.filter(
                (o) => o.status === "PROCESSING" || o.status === "PENDING",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Order History
        </h2>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-6xl mb-4">
              shopping_bag
            </span>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No orders yet
            </p>
            <a
              href="/social-boost"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                href={`/orders/${order.id}`}
                key={order.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#181620] hover:bg-gray-100 dark:hover:bg-[#1f1c2a] transition-colors block"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">
                      shopping_bag
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {order.serviceName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ${order.amount.toFixed(2)}
                    </p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-gray-400 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
