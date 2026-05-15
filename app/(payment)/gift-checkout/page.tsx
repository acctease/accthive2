"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth-client";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Ireland",
  "Portugal",
  "Greece",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Nigeria",
  "South Africa",
  "Kenya",
  "Ghana",
  "Egypt",
  "India",
  "China",
  "Japan",
  "South Korea",
  "Singapore",
  "Malaysia",
  "Thailand",
  "Indonesia",
  "Philippines",
  "Vietnam",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
];

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

export default function GiftCheckoutPage() {
  const router = useRouter();

  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [giftAmount, setGiftAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [message, setMessage] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<
    "EMAIL" | "SMS" | "WHATSAPP"
  >("EMAIL");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch wallet balance
        const balanceRes = await fetchWithAuth("/api/wallet/balance");
        const balanceData = await balanceRes.json();

        if (balanceData.success) {
          setWalletBalance(balanceData.data.balance);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load wallet balance");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(giftAmount);
    if (!amount || amount <= 0) {
      setError("Please enter a valid gift amount");
      return;
    }

    if (amount > walletBalance) {
      setError("Insufficient wallet balance");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await fetchWithAuth("/api/gifts/send", {
        method: "POST",
        body: JSON.stringify({
          amount,
          recipientName,
          recipientEmail,
          recipientPhone: recipientPhone || undefined,
          recipientCountry,
          recipientCity: recipientCity || undefined,
          recipientAddress: recipientAddress || undefined,
          message: message || undefined,
          deliveryMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to gifts page on success
        router.push("/gifts?success=true");
      } else {
        setError(data.error || "Failed to send gift");
      }
    } catch (err) {
      console.error("Gift send error:", err);
      setError("An error occurred while sending the gift");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-grow flex justify-center py-8 px-4">
        <div className="w-full max-w-[800px]">
          <div className="animate-pulse bg-white dark:bg-[#1d1a27] rounded-xl p-8">
            <div className="h-8 bg-gray-200 dark:bg-[#2c2839] rounded mb-4 w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-[#2c2839] rounded mb-8 w-3/4"></div>
            <div className="h-64 bg-gray-200 dark:bg-[#2c2839] rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  const amount = parseFloat(giftAmount) || 0;
  const hasInsufficientFunds = amount > 0 && walletBalance < amount;

  return (
    <main className="flex-grow flex justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[800px] flex flex-col gap-6">
        <div className="bg-white dark:bg-[#1d1a27] rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-[#2c2839]">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-[#2c2839] flex justify-between items-start flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">
                Send a Gift
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  card_giftcard
                </span>
                Global Gift Delivery
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                Wallet Balance
              </p>
              <p
                className={`text-xl font-bold font-mono ${
                  hasInsufficientFunds
                    ? "text-red-500"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                ${walletBalance.toFixed(2)}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Gift Amount */}
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                Gift Amount
              </h3>

              {/* Preset Amounts */}
              <div className="grid grid-cols-5 gap-3">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setGiftAmount(preset.toString())}
                    className={`p-3 rounded-xl border-2 transition-all font-bold ${
                      giftAmount === preset.toString()
                        ? "border-primary bg-primary/5 dark:bg-primary/10 text-primary"
                        : "border-gray-200 dark:border-[#2c2839] hover:border-primary/50 text-gray-900 dark:text-white"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                Recipient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country *
                  </label>
                  <select
                    required
                    value={recipientCountry}
                    onChange={(e) => setRecipientCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={recipientCity}
                    onChange={(e) => setRecipientCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                    placeholder="123 Main St"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                Delivery Method
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "EMAIL", icon: "mail", label: "Email" },
                  { value: "SMS", icon: "sms", label: "SMS" },
                  { value: "WHATSAPP", icon: "chat", label: "WhatsApp" },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setDeliveryMethod(method.value as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryMethod === method.value
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 dark:border-[#2c2839] hover:border-primary/50"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-3xl mb-2 ${
                        deliveryMethod === method.value
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      {method.icon}
                    </span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {method.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary resize-none"
                placeholder="Add a personal message to your gift..."
              />
            </div>

            {/* Insufficient Funds Warning */}
            {hasInsufficientFunds && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-2xl">
                  warning
                </span>
                <div className="flex-1">
                  <p className="text-red-500 font-bold mb-1">
                    Insufficient Funds
                  </p>
                  <p className="text-red-500/80 text-sm">
                    You need ${(amount - walletBalance).toFixed(2)} more to send
                    this gift.
                  </p>
                  <button
                    type="button"
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
                <span className="material-symbols-outlined text-red-500">
                  error
                </span>
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/gifting")}
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#1d1a27] hover:bg-gray-50 dark:hover:bg-[#2c2839] text-gray-900 dark:text-white font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={hasInsufficientFunds || processing || !giftAmount}
                className={`flex-1 h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  hasInsufficientFunds || processing || !giftAmount
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 active:scale-95"
                }`}
              >
                {processing ? (
                  <>
                    <span className="animate-spin material-symbols-outlined">
                      progress_activity
                    </span>
                    Sending Gift...
                  </>
                ) : (
                  <>
                    Send Gift ${amount > 0 ? amount.toFixed(2) : "0.00"}
                    <span className="material-symbols-outlined text-sm">
                      send
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
