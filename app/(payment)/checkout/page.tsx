"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth-client";
import { Suspense } from "react";

interface CartItem {
  serviceType: string;
  externalId: string;
  serviceName: string;
  serviceDescription?: string;
  price: number;
  meta?: Record<string, any>;
}

function CheckoutContent() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLink, setTargetLink] = useState("");

  useEffect(() => {
    // Read cart from localStorage
    try {
      const raw = localStorage.getItem("accthive_cart");
      if (raw) {
        setCart(JSON.parse(raw));
      } else {
        setError("No service selected. Please go back and choose a service.");
      }
    } catch {
      setError("Failed to read cart. Please go back and try again.");
    }

    // Fetch wallet balance
    async function fetchBalance() {
      try {
        const res = await fetchWithAuth("/api/wallet/balance");
        const data = await res.json();
        if (data.success) {
          setWalletBalance(data.data.balance);
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, []);

  const handleCheckout = async () => {
    if (!cart) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await fetchWithAuth("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          serviceType: cart.serviceType,
          externalId: cart.externalId,
          serviceName: cart.serviceName,
          serviceDescription: cart.serviceDescription,
          price: cart.price,
          meta: cart.meta,
          details: {
            targetLink: targetLink || undefined,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("accthive_cart");
        router.push("/orders?success=true");
      } else {
        setError(data.error || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("An error occurred during checkout");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-grow flex justify-center py-8 px-4">
        <div className="w-full max-w-[600px]">
          <div className="animate-pulse bg-white dark:bg-[#1d1a27] rounded-xl p-8">
            <div className="h-8 bg-gray-200 dark:bg-[#2c2839] rounded mb-4 w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-[#2c2839] rounded mb-8 w-3/4"></div>
            <div className="h-32 bg-gray-200 dark:bg-[#2c2839] rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !cart) {
    return (
      <main className="flex-grow flex justify-center py-8 px-4">
        <div className="w-full max-w-[600px]">
          <div className="bg-white dark:bg-[#1d1a27] rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
              error
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || "No service selected"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Please go back and select a service
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  const hasInsufficientFunds = walletBalance < cart.price;

  return (
    <main className="flex-grow flex justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[600px] flex flex-col gap-6">
        <div className="bg-white dark:bg-[#1d1a27] rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-[#2c2839]">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-[#2c2839] flex justify-between items-start flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">
                Checkout
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-base">lock</span>
                Secure Payment
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                Wallet Balance
              </p>
              <p className={`text-xl font-bold font-mono ${hasInsufficientFunds ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                ${walletBalance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Service Details */}
            <div className="bg-gray-50 dark:bg-[#181620] rounded-xl p-6">
              <h3 className="text-gray-900 dark:text-white font-bold mb-4">Service Details</h3>
              <div className="flex items-start gap-4">
                <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-3xl">star</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-1">
                    {cart.serviceName}
                  </h4>
                  {cart.serviceDescription && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      {cart.serviceDescription}
                    </p>
                  )}
                  <span className="inline-block px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">
                    {cart.serviceType}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-[#181620] rounded-xl p-5 space-y-3">
              <h3 className="text-gray-900 dark:text-white font-bold mb-3">Order Summary</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Service Price</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  ${cart.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Processing Fee</span>
                <span className="text-gray-900 dark:text-white font-medium">$0.00</span>
              </div>
              <div className="h-px bg-gray-200 dark:bg-[#2c2839] my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white font-bold">Total to Pay</span>
                <span className="text-primary font-bold text-lg">${cart.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Insufficient Funds Warning */}
            {hasInsufficientFunds && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-2xl">warning</span>
                <div className="flex-1">
                  <p className="text-red-500 font-bold mb-1">Insufficient Funds</p>
                  <p className="text-red-500/80 text-sm">
                    You need ${(cart.price - walletBalance).toFixed(2)} more to complete this purchase.
                  </p>
                  <button
                    onClick={() => router.push("/wallet")}
                    className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Add Funds
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">error</span>
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {/* Target Link Input for Social Boost */}
            {cart.serviceType === "social-boost" && (
              <div className="bg-gray-50 dark:bg-[#181620] rounded-xl p-6">
                <h3 className="text-gray-900 dark:text-white font-bold mb-4">Target Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Link or Username to Boost
                  </label>
                  <input
                    type="text"
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    placeholder="e.g. https://instagram.com/p/..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Please make sure the account/post is public.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#1d1a27] hover:bg-gray-50 dark:hover:bg-[#2c2839] text-gray-900 dark:text-white font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={
                  hasInsufficientFunds ||
                  processing ||
                  (cart.serviceType === "social-boost" && !targetLink)
                }
                className={`flex-1 h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  hasInsufficientFunds ||
                  processing ||
                  (cart.serviceType === "social-boost" && !targetLink)
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 active:scale-95"
                }`}
              >
                {processing ? (
                  <>
                    <span className="animate-spin material-symbols-outlined">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Purchase
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Footer */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <div className="flex items-center justify-center gap-4 opacity-60">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-xl">verified_user</span>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Secure</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-xl">lock</span>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Encrypted</span>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 max-w-xs">
                Payment will be deducted from your wallet balance
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
