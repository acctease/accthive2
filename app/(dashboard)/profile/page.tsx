"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/auth-client";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  wallets: Array<{
    id: string;
    balance: number;
  }>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetchWithAuth("/api/auth/me");
        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

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

  if (!profile) {
    return (
      <div className="p-4 sm:p-8">
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account information
        </p>
      </header>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-8 border border-gray-200 dark:border-[#2c2839]">
        <div className="flex items-center gap-6 mb-8">
          <div className="size-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#181620]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400">
                person
              </span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {profile.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#181620]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400">
                email
              </span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email Address
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#181620]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400">
                account_balance_wallet
              </span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Wallet Balance
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  ${profile.wallets[0]?.balance.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#181620]">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400">
                badge
              </span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  User ID
                </p>
                <p className="font-mono text-sm text-gray-900 dark:text-white">
                  {profile.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Account Actions
        </h3>
        <div className="space-y-3">
          <button className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#181620] hover:bg-gray-100 dark:hover:bg-[#1f1c2a] text-left transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">
                edit
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                Edit Profile
              </span>
            </div>
            <span className="material-symbols-outlined text-gray-400">
              chevron_right
            </span>
          </button>

          <button className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#181620] hover:bg-gray-100 dark:hover:bg-[#1f1c2a] text-left transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">
                lock
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                Change Password
              </span>
            </div>
            <span className="material-symbols-outlined text-gray-400">
              chevron_right
            </span>
          </button>

          <button className="w-full p-4 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-left transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">
                logout
              </span>
              <span className="font-medium text-red-500">Sign Out</span>
            </div>
            <span className="material-symbols-outlined text-red-500">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
