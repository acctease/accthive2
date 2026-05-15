"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/auth-client";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

type DepositStep = "SELECT" | "DETAILS" | "PROCESSING" | "COMPLETE";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<DepositStep>("SELECT");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [processingTimeLeft, setProcessingTimeLeft] = useState(0);

  // Gift Card State
  const [giftCardCode, setGiftCardCode] = useState("");

  useEffect(() => {
    fetchWalletData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (modalStep === "PROCESSING" && processingTimeLeft > 0) {
      interval = setInterval(() => {
        setProcessingTimeLeft((prev) => {
          if (prev <= 1) {
            completeDeposit(); // Auto-complete when timer hits 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [modalStep, processingTimeLeft]);

  async function fetchWalletData() {
    try {
      // Fetch balance
      const balanceRes = await fetchWithAuth("/api/wallet/balance");
      const balanceData = await balanceRes.json();
      if (balanceData.success) {
        setBalance(balanceData.data.balance);
      }

      // Fetch transactions
      const transactionsRes = await fetchWithAuth("/api/wallet/transactions");
      const transactionsData = await transactionsRes.json();
      if (transactionsData.success) {
        setTransactions(transactionsData.data.transactions);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  }

  function initiateDeposit() {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;
    setModalStep("SELECT");
    setShowModal(true);
  }

  function handleMethodSelect(method: string) {
    setSelectedMethod(method);
    setModalStep("DETAILS");
  }

  function startProcessing() {
    let duration = 5; // Default fallback
    if (selectedMethod === "Crypto") duration = 10;
    if (selectedMethod === "Bank Transfer") duration = 20;
    if (selectedMethod === "Gift Cards") duration = 30;

    setProcessingTimeLeft(duration);
    setModalStep("PROCESSING");
  }

  async function completeDeposit() {
    setIsDepositing(true);
    const amount = parseFloat(depositAmount);

    try {
      // Include gift card code in payment method string if applicable
      const methodLabel =
        selectedMethod === "Gift Cards"
          ? `Gift Card (${giftCardCode.slice(-4)})`
          : selectedMethod;

      const response = await fetchWithAuth("/api/wallet/deposit", {
        method: "POST",
        body: JSON.stringify({ amount, paymentMethod: methodLabel }),
      });

      const data = await response.json();
      if (data.success) {
        setBalance(data.data.balance);
        setModalStep("COMPLETE");
        // Refresh transactions
        await fetchWalletData();
      }
    } catch (error) {
      console.error("Deposit error:", error);
    } finally {
      setIsDepositing(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setDepositAmount("");
    setGiftCardCode("");
    setSelectedMethod("");
    setModalStep("SELECT");
  }

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
    <div className="p-4 sm:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto relative">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Wallet
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your balance and transactions
        </p>
      </header>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">
              account_balance_wallet
            </span>
            <div>
              <p className="text-white/80 text-sm font-medium">Total Balance</p>
              <p className="text-4xl font-bold">${(balance || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Section */}
      <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Add Funds
        </h2>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
              $
            </span>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={initiateDeposit}
            disabled={!depositAmount}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deposit
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          {[25, 50, 100, 250].map((amount) => (
            <button
              key={amount}
              onClick={() => setDepositAmount(amount.toString())}
              className="px-4 py-2 bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#383348] text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-colors"
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h2>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-6xl mb-4">
              receipt_long
            </span>
            <p className="text-gray-500 dark:text-gray-400">
              No transactions yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#181620] hover:bg-gray-100 dark:hover:bg-[#1f1c2a] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`size-12 rounded-full flex items-center justify-center ${
                      transaction.type === "DEPOSIT"
                        ? "bg-green-500/10 text-green-500"
                        : transaction.type === "PAYMENT"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {transaction.type === "DEPOSIT"
                        ? "arrow_downward"
                        : "arrow_upward"}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-bold ${
                    transaction.type === "DEPOSIT"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "DEPOSIT" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-[#2c2839]">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalStep === "SELECT" && "Select Payment Method"}
                {modalStep === "DETAILS" && `${selectedMethod} Details`}
                {modalStep === "PROCESSING" && "Processing Payment"}
                {modalStep === "COMPLETE" && "Deposit Successful"}
              </h3>
              {modalStep !== "PROCESSING" && (
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>

            {/* STEP 1: Select Method */}
            {modalStep === "SELECT" && (
              <div className="space-y-3">
                {[
                  {
                    id: "Crypto",
                    icon: "currency_bitcoin",
                    name: "Cryptocurrency",
                    desc: "USDT, BTC, ETH (Instant)",
                  },
                  {
                    id: "Bank Transfer",
                    icon: "account_balance",
                    name: "Bank Transfer",
                    desc: "Wire transfer (1-3 days)",
                  },
                  {
                    id: "Gift Cards",
                    icon: "card_giftcard",
                    name: "Gift Cards",
                    desc: "Redeem code (Instant)",
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-[#2c2839] hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-left group"
                  >
                    <div className="size-12 rounded-full bg-gray-100 dark:bg-[#2c2839] group-hover:bg-primary/20 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">
                        {method.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {method.desc}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: Details */}
            {modalStep === "DETAILS" && (
              <div className="space-y-6">
                {selectedMethod === "Crypto" && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-[#131118] p-4 rounded-xl text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Send <span className="font-bold">${depositAmount}</span>{" "}
                        (USDT TRC20) to:
                      </p>
                      <code className="block bg-white dark:bg-[#2c2839] p-3 rounded-lg text-sm font-mono break-all border border-dashed border-gray-300 dark:border-gray-600">
                        TQn9Y2khEsALHE1f1g6k9fL5h8z9j7L3k5
                      </code>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Deposit will be credited automatically after 1
                      confirmation.
                    </p>
                  </div>
                )}

                {selectedMethod === "Bank Transfer" && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-[#131118] p-4 rounded-xl text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bank Name:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          Global Trust Bank
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Name:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          Accthive LLC
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Number:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          1234 5678 9012
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reference:</span>
                        <span className="font-bold text-primary">
                          USER-{Math.floor(Math.random() * 10000)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-lg border border-blue-100 dark:border-blue-500/20 text-xs text-blue-600 dark:text-blue-400">
                      ⚠️ Please include the Reference code in your transfer
                      remark.
                    </div>
                  </div>
                )}

                {selectedMethod === "Gift Cards" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gift Card Code
                      </label>
                      <input
                        type="text"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        value={giftCardCode}
                        onChange={(e) => setGiftCardCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#131118] text-gray-900 dark:text-white focus:outline-none focus:border-primary font-mono uppercase"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Supported cards: Amazon, Visa, Mastercard, Apple.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setModalStep("SELECT")}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#383348] text-gray-900 dark:text-white font-bold rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={startProcessing}
                    disabled={selectedMethod === "Gift Cards" && !giftCardCode}
                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {selectedMethod === "Gift Cards" ? "Redeem" : "I Have Paid"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Processing */}
            {modalStep === "PROCESSING" && (
              <div className="text-center py-8">
                <div className="relative size-20 mx-auto mb-6">
                  <svg className="size-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="100, 100"
                      className="text-primary animate-spin origin-center"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-primary">
                    {processingTimeLeft}s
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Verifying Transaction
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Please wait while we confirm your{" "}
                  {selectedMethod.toLowerCase()}.
                </p>
              </div>
            )}

            {/* STEP 4: Complete */}
            {modalStep === "COMPLETE" && (
              <div className="text-center py-6">
                <div className="size-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl">
                    check
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Deposit Successful!
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Your wallet has been credited with ${depositAmount}.
                </p>
                <button
                  onClick={closeModal}
                  className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
