"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth-client";

interface Gift {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientCountry: string;
  amount: number;
  status: string;
  deliveryMethod: string;
  createdAt: string;
  message?: string;
}

export default function GlobalGiftingPage() {
  const router = useRouter();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSent: 0,
    delivered: 0,
    pending: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    async function fetchGifts() {
      try {
        const response = await fetchWithAuth("/api/gifts?limit=10");
        const data = await response.json();

        if (data.success) {
          const giftsList = data.data.gifts || [];
          setGifts(giftsList);

          // Calculate stats
          const totalSent = giftsList.length;
          const delivered = giftsList.filter(
            (g: Gift) => g.status === "DELIVERED",
          ).length;
          const pending = giftsList.filter(
            (g: Gift) => g.status === "PENDING" || g.status === "SENT",
          ).length;
          const totalSpent = giftsList.reduce(
            (sum: number, g: Gift) => sum + g.amount,
            0,
          );

          setStats({ totalSent, delivered, pending, totalSpent });
        }
      } catch (error) {
        console.error("Error fetching gifts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGifts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-500/10 text-green-500";
      case "SENT":
        return "bg-blue-500/10 text-blue-500";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500";
      case "FAILED":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case "EMAIL":
        return "email";
      case "SMS":
        return "sms";
      case "WHATSAPP":
        return "chat";
      default:
        return "send";
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center px-4 md:px-10 pb-16">
        <div className="w-full max-w-7xl flex flex-col">
          <div className="animate-pulse space-y-6 py-10">
            <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
              <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
              <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 md:px-10 pb-16">
      <div className="w-full max-w-7xl flex flex-col">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Global Gifting
            </h1>
            <p className="text-gray-500 dark:text-[#a39cba] text-lg font-normal">
              Send money as gifts worldwide. Instant delivery via email, SMS, or
              WhatsApp.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/gifts")}
              className="flex items-center justify-center rounded-full h-12 px-6 bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#3d384e] text-gray-900 dark:text-white font-bold transition-all border border-gray-200 dark:border-white/5 cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2 text-[20px]">
                history
              </span>
              View All Gifts
            </button>
            <button
              onClick={() => router.push("/gift-checkout")}
              className="flex items-center justify-center rounded-full h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2 text-[20px]">
                card_giftcard
              </span>
              Send Gift
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white dark:bg-[#1d1a27] border border-gray-200 dark:border-[#2c2839]">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined">redeem</span>
              <span className="text-sm font-bold uppercase tracking-wider">
                Total Sent
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalSent}
            </p>
          </div>
          <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white dark:bg-[#1d1a27] border border-gray-200 dark:border-[#2c2839]">
            <div className="flex items-center gap-3 text-green-500">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="text-sm font-bold uppercase tracking-wider">
                Delivered
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.delivered}
            </p>
          </div>
          <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white dark:bg-[#1d1a27] border border-gray-200 dark:border-[#2c2839]">
            <div className="flex items-center gap-3 text-blue-500">
              <span className="material-symbols-outlined">pending</span>
              <span className="text-sm font-bold uppercase tracking-wider">
                Pending
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.pending}
            </p>
          </div>
          <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white dark:bg-[#1d1a27] border border-gray-200 dark:border-[#2c2839]">
            <div className="flex items-center gap-3 text-purple-500">
              <span className="material-symbols-outlined">wallet</span>
              <span className="text-sm font-bold uppercase tracking-wider">
                Total Spent
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${stats.totalSpent.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Recent Gifts */}
        <div className="bg-white dark:bg-[#1d1a27] rounded-2xl border border-gray-200 dark:border-[#2c2839] overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-[#2c2839]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Gifts
            </h2>
          </div>
          {gifts.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-6xl mb-4">
                card_giftcard
              </span>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No gifts sent yet
              </p>
              <button
                onClick={() => router.push("/gift-checkout")}
                className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors"
              >
                Send Your First Gift
              </button>
            </div>
          ) : (
            <div className="space-y-3 p-6">
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#181620] hover:bg-gray-100 dark:hover:bg-[#1f1c2a] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">
                        {getDeliveryIcon(gift.deliveryMethod)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {gift.recipientName}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {gift.recipientEmail} • {gift.recipientCountry}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(gift.createdAt).toLocaleDateString()} at{" "}
                        {new Date(gift.createdAt).toLocaleTimeString()}
                      </p>
                      {gift.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                          "{gift.message}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        ${gift.amount.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(
                          gift.status,
                        )}`}
                      >
                        {gift.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 w-full rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 md:p-12 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Send Love Globally
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Connect with friends, family, and colleagues worldwide. Send
                money as gifts instantly via email, SMS, or WhatsApp.
              </p>
            </div>
            <button
              onClick={() => router.push("/gift-checkout")}
              className="flex shrink-0 items-center justify-center rounded-full h-14 px-8 bg-primary hover:bg-primary/90 text-white font-extrabold text-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Send Gift Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
