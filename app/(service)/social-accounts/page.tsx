"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { History, ShoppingCart, Grid, ShoppingBag, Plus } from "lucide-react";

interface SocialAccount {
  id: string;
  name: string;
  price: string;
  amount: number;
  description: string;
  min: string;
  max: string;
  category: string;
}

const translationCache = new Map<string, string>();

async function translateText(text: string): Promise<string> {
  if (!text) return text;
  
  const cacheKey = text;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey) || text;
  }

  try {
    const params = new URLSearchParams({
      client: 'gtx',
      sl: 'vi',
      tl: 'en',
      dt: 't',
      q: text
    });

    const response = await fetch(
      `https://translate.google.com/translate_a/single?${params}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Google Translate API returns array: [[[translated_text, original_text, ...]]]
      if (Array.isArray(data) && data[0]) {
        const translated = data[0][0][0];
        if (translated) {
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch (error) {
    console.error("Translation error:", error);
  }
  return text;
}

export default function SocialAccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true);
        const response = await fetch("/api/social-accounts");
        const data = await response.json();

        if (data.success) {
          // Just set the data as-is (Vietnamese)
          setAccounts(data.data);
          const uniqueCategories = Array.from(
            new Set(data.data.map((a: SocialAccount) => a.category))
          ) as string[];
          setCategories(uniqueCategories);
        } else {
          setError(data.error || "Failed to load accounts");
        }
      } catch (err) {
        setError("Failed to load accounts");
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  // Auto-translate accounts one by one after loading
  useEffect(() => {
    if (!accounts.length || loading) return;

    const browserLang = navigator.language.toLowerCase();
    const isEnglish = browserLang.startsWith("en");
    
    if (!isEnglish) return;

    setTranslating(true);

    const translateAccountsSequentially = async () => {
      // Translate each account one by one
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        
        const translatedName = await translateText(account.name);
        const translatedDescription = await translateText(account.description);
        const translatedCategory = await translateText(account.category);
        
        // Update this specific account in the state
        setAccounts(prevAccounts => {
          const updated = [...prevAccounts];
          updated[i] = {
            ...updated[i],
            name: translatedName,
            description: translatedDescription,
            category: translatedCategory,
          };
          return updated;
        });

        // Small delay between translations for visual effect
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setTranslating(false);
    };

    translateAccountsSequentially();
  }, [loading, accounts.length]);

  const filteredAccounts = accounts.filter(account => {
    const matchesCategory = selectedCategory === "all" || account.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleAddToCart = (account: SocialAccount) => {
    const priceVal = parseFloat((parseInt(account.price) * 2 / 25000).toFixed(2));
    // Store cart context in localStorage for checkout page
    localStorage.setItem(
      "accthive_cart",
      JSON.stringify({
        serviceType: "social-accounts",
        externalId: `account_${account.id}`,
        serviceName: account.name,
        serviceDescription: account.description || `Premium ${account.category} account`,
        price: priceVal,
        meta: {
          externalAccountId: account.id,
          name: account.name,
          category: account.category,
          amount: account.amount,
          min: account.min,
          max: account.max,
        },
      })
    );
    router.push("/checkout");
  };

  return (
    <main className="flex-1 flex flex-col items-center px-4 md:px-10 pb-16">
      <div className="w-full max-w-7xl flex flex-col">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Premium Social Accounts
            </h1>
            <p className="text-gray-500 dark:text-[#a39cba] text-lg font-normal">
              Get verified, aged, and established social media accounts ready
              for immediate use.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center rounded-full h-12 px-6 bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#3d384e] text-gray-900 dark:text-white font-bold transition-all border border-gray-200 dark:border-white/5 cursor-pointer">
              <History className="mr-2" size={20} />
              My Accounts
            </button>
            <button className="flex items-center justify-center rounded-full h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer">
              <ShoppingCart className="mr-2" size={20} />
              Browse
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 pb-8 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setSelectedCategory("all")}
            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 font-bold transition-colors border cursor-pointer ${
              selectedCategory === "all"
                ? "bg-white dark:bg-white text-gray-900 dark:text-background-dark border-gray-200 dark:border-transparent"
                : "bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#3d384e] text-gray-700 dark:text-white border-gray-200 dark:border-white/5"
            }`}
          >
            <Grid size={20} />
            All Accounts
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors border cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#3d384e] text-gray-700 dark:text-white border-gray-200 dark:border-white/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search accounts by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#1d1a27] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Accounts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === "all" ? "All Accounts" : selectedCategory}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {translating && <span className="inline-block mr-2 text-sm font-medium text-primary">✓ Translating live...</span>}
              {filteredAccounts.length} accounts available
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] animate-pulse flex items-center justify-between"
                >
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-[#2c2839] rounded w-48" />
                    <div className="h-4 bg-gray-200 dark:bg-[#2c2839] rounded w-96" />
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-[#2c2839] rounded w-20" />
                </div>
              ))}
            </div>
          ) : filteredAccounts.length > 0 ? (
            <div className="space-y-4">
              {filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] hover:border-primary dark:hover:border-primary transition-all cursor-pointer group flex items-start justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                      {account.name}
                    </h3>

                    {account.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {account.description.replace(/\r\n/g, " ").substring(0, 120)}...
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs block mb-1">Stock</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {account.amount > 0 ? account.amount : "Out of stock"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block mb-1">Min/Max</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {account.min} - {account.max === "1000000" ? "∞" : account.max}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block mb-1">Category</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {account.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <span className="text-2xl font-bold text-primary">
                        ${(parseInt(account.price) * 2 / 25000).toFixed(2)}
                      </span>
                    </div>
                    <button 
                      disabled={account.amount === 0}
                      onClick={() => handleAddToCart(account)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all mt-4 cursor-pointer ${
                        account.amount === 0
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="text-gray-300 dark:text-gray-600 mb-4 mx-auto" size={60} />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No accounts found in this category
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 w-full rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 md:p-12 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Buy Established Accounts?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Skip the waiting period and start with accounts that have
                history, followers, and credibility. Perfect for marketing
                agencies and businesses.
              </p>
            </div>
            <button className="flex shrink-0 items-center justify-center rounded-full h-14 px-8 bg-primary hover:bg-primary/90 text-white font-extrabold text-lg transition-transform hover:scale-105 cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
