"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OrderDetails {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  amount: number;
  status: string;
  details: any;
  createdAt: string;
}

type SMSStep = "IDLE" | "NUMBER_GENERATED" | "WAITING_OTP" | "COMPLETED";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // SMS Service State
  const [smsStep, setSmsStep] = useState<SMSStep>("IDLE");
  const [smsNumber, setSmsNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (smsStep === "WAITING_OTP" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            // Timer finished, receive code
            handleReceiveCode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [smsStep, otpTimer]);

  async function fetchOrder() {
    try {
      const response = await fetchWithAuth(`/api/orders/${id}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || "Failed to fetch order");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("An error occurred while fetching the order");
    } finally {
      setLoading(false);
    }
  }

  // SMS Flow Handlers
  function handleGetNumber() {
    // Generate a random US number
    const num = `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    setSmsNumber(num);
    setSmsStep("NUMBER_GENERATED");

    // Auto-start waiting for code after 2 seconds to simulate network delay
    setTimeout(() => {
      setSmsStep("WAITING_OTP");
      setOtpTimer(15); // Wait 15 seconds for code
    }, 2000);
  }

  function handleReceiveCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSmsCode(code);
    setSmsStep("COMPLETED");
  }

  // Helper to generate mock credentials if none exist
  const getSocialCredentials = (serviceName: string, existingDetails: any) => {
    // If we have real credentials, use them (checking for some known field like username)
    if (existingDetails && existingDetails.username) {
      return existingDetails;
    }

    const nameLower = serviceName.toLowerCase();

    // Default mock data
    const mock = {
      username: "user_12345",
      password: "MockPassword123!",
      email: "user_12345@email.com",
      recoveryEmail: "recovery@email.com",
      twoFactorCode: "A1B2 C3D4 E5F6",
      instructions:
        "Login using the browser extensions for cookies if provided.",
    };

    if (nameLower.includes("facebook")) {
      return {
        ...mock,
        platform: "Facebook",
        username: "fb_mark_test",
        profileUrl: "facebook.com/fb_mark_test",
        cookies: '[{"domain": ".facebook.com", ...}]',
      };
    }

    if (nameLower.includes("youtube") || nameLower.includes("google")) {
      return {
        ...mock,
        platform: "YouTube/Google",
        username: "tube_creator_99",
        channelUrl: "youtube.com/channel/UC123456789",
        instructions:
          "Login to Google. Do not change recovery email for 7 days.",
      };
    }

    if (nameLower.includes("tiktok")) {
      return {
        ...mock,
        platform: "TikTok",
        username: "tiktok_star_x",
        profileUrl: "tiktok.com/@tiktok_star_x",
      };
    }

    if (nameLower.includes("instagram")) {
      return {
        ...mock,
        platform: "Instagram",
        username: "insta_guru",
        profileUrl: "instagram.com/insta_guru",
      };
    }

    if (nameLower.includes("twitter") || nameLower.includes("x ")) {
      return {
        ...mock,
        platform: "X (Twitter)",
        username: "twitter_bird",
        profileUrl: "x.com/twitter_bird",
      };
    }

    return {
      ...mock,
      platform: "Social Account",
    };
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {error || "Order not found"}
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 text-primary font-bold hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isSocialAccount = order.serviceCategory === "social-accounts";
  const isSmsService = order.serviceCategory === "sms-service";
  const credentials = isSocialAccount
    ? getSocialCredentials(order.serviceName, order.details)
    : null;

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex items-center gap-4">
        <Link
          href="/orders"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
            arrow_back
          </span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Order Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">#{order.id}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Card */}
          <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Service Information
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">
                  {isSocialAccount
                    ? "account_circle"
                    : isSmsService
                      ? "sms"
                      : "shopping_bag"}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {order.serviceName}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 capitalize">
                  {order.serviceCategory.replace("-", " ")}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center py-4 border-t border-gray-100 dark:border-white/5">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === "COMPLETED"
                    ? "bg-green-500/10 text-green-500"
                    : order.status === "PROCESSING"
                      ? "bg-blue-500/10 text-blue-500"
                      : order.status === "PENDING"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center py-4 border-t border-gray-100 dark:border-white/5">
              <span className="text-gray-500 dark:text-gray-400">Date</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-4 border-t border-gray-100 dark:border-white/5">
              <span className="text-gray-500 dark:text-gray-400">
                Amount Paid
              </span>
              <span className="text-xl font-bold text-primary">
                ${order.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Social Boost Progress Section */}
          {order.serviceCategory === "social-boost" && (
            <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">
                  rocket_launch
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Boost Progress
                </h2>
              </div>

              <div className="space-y-6">
                {/* Target Link Display */}
                <div className="bg-gray-50 dark:bg-[#181620] p-4 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Target Link / Profile
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-600 dark:text-blue-400 truncate flex-1 block">
                      <a
                        href={
                          order.details?.targetLink?.startsWith("http")
                            ? order.details.targetLink
                            : `https://${order.details?.targetLink}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {order.details?.targetLink || "No link provided"}
                      </a>
                    </span>
                    <span className="material-symbols-outlined text-gray-400 text-sm">
                      open_in_new
                    </span>
                  </div>
                </div>

                {/* Progress Bar Simulation */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {order.status === "COMPLETED"
                        ? "Delivered"
                        : "In Progress"}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {order.status === "COMPLETED" ? "100%" : "45%"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-[#2c2839] rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${order.status === "COMPLETED" ? "bg-green-500 w-full" : "bg-primary w-[45%]"}`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {order.status === "COMPLETED"
                      ? "Boost completed successfully!"
                      : "Estimated completion: < 24 hours"}
                  </p>
                </div>

                {order.status === "PROCESSING" && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-4 rounded-xl flex gap-3">
                    <span className="material-symbols-outlined text-blue-500">
                      info
                    </span>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your order is active. You will see results appearing on
                      your profile shortly. Please verify your profile is
                      public.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gifting Order Tracking Section */}
          {order.serviceCategory === "gifting" && (
            <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-purple-500 text-2xl">
                  local_shipping
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Gift Status
                </h2>
              </div>

              <div className="space-y-8">
                {/* Recipient Info */}
                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600 dark:text-purple-300 uppercase font-bold tracking-wide mb-1">
                      Sent To
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {order.details?.recipientName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-sm">
                        public
                      </span>
                      {order.details?.recipientCountry}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600 dark:text-purple-300 uppercase font-bold tracking-wide mb-1">
                      Via
                    </p>
                    <div className="flex items-center justify-end gap-1 text-gray-900 dark:text-white font-medium">
                      <span className="material-symbols-outlined">
                        {order.details?.deliveryMethod === "EMAIL"
                          ? "mail"
                          : order.details?.deliveryMethod === "SMS"
                            ? "sms"
                            : "chat"}
                      </span>
                      {order.details?.deliveryMethod}
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="relative pl-4 space-y-8 py-2">
                  {/* Line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-[#2c2839]"></div>

                  {/* Step 1: Ordered */}
                  <div className="relative flex gap-4">
                    <div className="size-2.5 rounded-full bg-green-500 absolute left-[15px] top-2 ring-4 ring-green-500/20"></div>
                    <div className="pl-6">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        Order Placed
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Processed */}
                  <div className="relative flex gap-4">
                    <div className="size-2.5 rounded-full bg-green-500 absolute left-[15px] top-2 ring-4 ring-green-500/20"></div>
                    <div className="pl-6">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        Payment Processed
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Automatically verified
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Sending/Sent (Active) */}
                  <div className="relative flex gap-4">
                    <div
                      className={`size-2.5 rounded-full absolute left-[15px] top-2 ring-4 
                                ${order.status === "COMPLETED" ? "bg-green-500 ring-green-500/20" : "bg-primary ring-primary/20 animate-pulse"}`}
                    ></div>
                    <div className="pl-6">
                      <p
                        className={`font-bold text-sm ${order.status === "COMPLETED" ? "text-gray-900 dark:text-white" : "text-primary"}`}
                      >
                        {order.status === "COMPLETED"
                          ? "Git Sent"
                          : "Sending Gift..."}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.status === "COMPLETED"
                          ? "Delivered successfully"
                          : "Contacting recipient..."}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative flex gap-4 opacity-50">
                    <div
                      className={`size-2.5 rounded-full bg-gray-300 dark:bg-gray-600 absolute left-[15px] top-2 
                                ${order.status === "COMPLETED" ? "bg-green-500 ring-4 ring-green-500/20" : ""}`}
                    ></div>
                    <div className="pl-6">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        Recipient Confirmed
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Pending action by recipient
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Credentials Section */}
          {isSocialAccount && credentials && (
            <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">
                  lock
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Account Credentials
                </h2>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 p-4 rounded-xl mb-6 text-sm text-yellow-800 dark:text-yellow-200">
                Please save these credentials immediately. For security reasons,
                we recommend changing the password after your first login.
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-[#181620] p-4 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Username / ID
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-gray-900 dark:text-white font-medium">
                        {credentials.username}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(credentials.username)
                        }
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          content_copy
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-[#181620] p-4 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Password
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-gray-900 dark:text-white font-medium">
                        {credentials.password}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(credentials.password)
                        }
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          content_copy
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-[#181620] p-4 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Email
                    </p>
                    <span className="font-mono text-gray-900 dark:text-white font-medium block truncate">
                      {credentials.email}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#181620] p-4 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      2FA / Recovery
                    </p>
                    <span className="font-mono text-gray-900 dark:text-white font-medium block truncate">
                      {credentials.twoFactorCode}
                    </span>
                  </div>
                </div>

                {credentials.instructions && (
                  <div className="bg-gray-50 dark:bg-[#181620] p-4 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Instructions
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {credentials.instructions}
                    </p>
                  </div>
                )}

                {credentials.cookies && (
                  <div className="bg-gray-50 dark:bg-[#181620] p-4 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Cookies (JSON)
                    </p>
                    <div className="relative">
                      <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap max-h-24">
                        {credentials.cookies}
                      </pre>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(credentials.cookies)
                        }
                        className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          content_copy
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SMS Service Verification Section */}
          {isSmsService && (
            <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">
                  sms
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  SMS Verification
                </h2>
              </div>

              {smsStep === "IDLE" && (
                <div className="text-center py-6">
                  <div className="size-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl">
                      phonelink_ring
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Verify
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Click below to generate a temporary phone number for{" "}
                    {order.serviceName}. You will have 15 minutes to receive the
                    code.
                  </p>
                  <button
                    onClick={handleGetNumber}
                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20"
                  >
                    Get Verification Number
                  </button>
                </div>
              )}

              {(smsStep === "NUMBER_GENERATED" ||
                smsStep === "WAITING_OTP" ||
                smsStep === "COMPLETED") && (
                <div className="space-y-6">
                  {/* Phone Number Display */}
                  <div className="bg-gray-50 dark:bg-[#181620] p-6 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-bold">
                      Your Virtual Number
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl md:text-4xl font-mono font-bold text-gray-900 dark:text-white">
                        {smsNumber}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(smsNumber)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
                        title="Copy Number"
                      >
                        <span className="material-symbols-outlined">
                          content_copy
                        </span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Use this number to verify your account on{" "}
                      {order.serviceName}
                    </p>
                  </div>

                  {/* Waiting UI */}
                  {(smsStep === "NUMBER_GENERATED" ||
                    smsStep === "WAITING_OTP") && (
                    <div className="flex flex-col items-center py-4">
                      <div className="flex items-center gap-3 text-primary mb-2">
                        <span className="material-symbols-outlined animate-spin">
                          refresh
                        </span>
                        <span className="font-bold">Waiting for SMS...</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        The code will appear here automatically.{" "}
                        {smsStep === "WAITING_OTP" && `(~${otpTimer}s)`}
                      </p>
                      <div className="w-full max-w-xs bg-gray-200 dark:bg-[#2c2839] h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-primary animate-progress-indeterminate"></div>
                      </div>
                    </div>
                  )}

                  {/* Code Received UI */}
                  {smsStep === "COMPLETED" && (
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center">
                      <p className="text-sm text-green-600 dark:text-green-500 font-bold mb-2 uppercase tracking-wide">
                        Verification Code Received
                      </p>
                      <div className="text-5xl font-mono font-black text-gray-900 dark:text-white tracking-widest mb-4">
                        {smsCode}
                      </div>
                      <button
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled
                      >
                        Code Used / Completed
                      </button>
                      <p className="text-xs text-gray-500 mt-3">
                        This number cannot be used again.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Need Help?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              If you have trouble accessing your account, please contact our
              support team immediately.
            </p>
            <button className="w-full py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">
                support_agent
              </span>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
