"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth-client";

interface Gift {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientCountry: string;
  amount: number;
  status: string;
  deliveryMethod: string;
  message?: string;
  createdAt: string;
  sentAt?: string;
  deliveredAt?: string;
  service: {
    name: string;
    category: string;
  };
}

import { Suspense } from "react";

function GiftsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    pending: 0,
  });

  useEffect(() => {
    async function fetchGifts() {
      try {
        const response = await fetchWithAuth("/api/gifts");
        const data = await response.json();

        if (data.success) {
          setGifts(data.data);

          // Calculate stats
          const total = data.data.length;
          const sent = data.data.filter(
            (g: Gift) => g.status === "SENT",
          ).length;
          const delivered = data.data.filter(
            (g: Gift) => g.status === "DELIVERED",
          ).length;
          const pending = data.data.filter(
            (g: Gift) => g.status === "PENDING",
          ).length;

          setStats({ total, sent, delivered, pending });
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
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "SENT":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "PENDING":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "FAILED":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "check_circle";
      case "SENT":
        return "send";
      case "PENDING":
        return "schedule";
      case "FAILED":
        return "error";
      default:
        return "help";
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded-2xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gift History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track all your sent gifts
          </p>
        </div>
        <button
          onClick={() => router.push("/gifting")}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">card_giftcard</span>
          Send New Gift
        </button>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-green-500 text-2xl">
            check_circle
          </span>
          <div>
            <p className="text-green-500 font-bold">Gift Sent Successfully!</p>
            <p className="text-green-500/80 text-sm">
              Your gift has been sent and the recipient will receive it shortly.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">
              card_giftcard
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Total Gifts
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-blue-500 text-3xl">
              send
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Sent
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.sent}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-green-500 text-3xl">
              check_circle
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Delivered
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.delivered}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-yellow-500 text-3xl">
              schedule
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Pending
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.pending}
          </p>
        </div>
      </div>

      {/* Gifts List */}
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
              You haven't sent any gifts yet
            </p>
            <button
              onClick={() => router.push("/gifting")}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors"
            >
              Send Your First Gift
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-[#2c2839]">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-[#181620] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">
                        card_giftcard
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-gray-900 dark:text-white font-bold">
                            {gift.service.name}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            To: {gift.recipientName} ({gift.recipientEmail})
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 dark:text-white font-bold">
                            ${gift.amount.toFixed(2)}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {new Date(gift.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                            gift.status,
                          )}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {getStatusIcon(gift.status)}
                          </span>
                          {gift.status}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            public
                          </span>
                          {gift.recipientCountry}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            {gift.deliveryMethod === "EMAIL"
                              ? "mail"
                              : gift.deliveryMethod === "SMS"
                                ? "sms"
                                : "chat"}
                          </span>
                          {gift.deliveryMethod}
                        </span>
                      </div>
                      {gift.message && (
                        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm italic">
                          "{gift.message}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GiftsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <GiftsContent />
    </Suspense>
  );
}
