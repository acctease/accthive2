"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Country {
  id: number;
  full_name: string;
  link: string;
  picture: string;
}

interface App {
  id: number;
  full_name: string;
  picture: string;
  timestamp: string;
  link: string;
  trending: number;
  deduct: string;
}

export default function SMSVerificationPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search states
  const [countrySearch, setCountrySearch] = useState("");
  const [appSearch, setAppSearch] = useState("");

  // Fetch countries on mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoadingCountries(true);
        const response = await fetch("/api/sms/countries");
        const data = await response.json();

        if (data.success) {
          setCountries(data.data);
        } else {
          setError(data.error || "Failed to load countries");
        }
      } catch (err) {
        setError("Failed to load countries");
        console.error("Error fetching countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    }

    fetchCountries();
  }, []);

  // Fetch apps when country is selected
  const handleCountrySelect = async (country: Country) => {
    setSelectedCountry(country);
    setAppSearch(""); // Reset app search when switching countries
    setLoadingApps(true);
    setError(null);

    try {
      const response = await fetch(`/api/sms/apps?country_id=${country.id}`);
      const data = await response.json();

      if (data.success) {
        setApps(data.data);
      } else {
        setError(data.error || "Failed to load apps");
      }
    } catch (err) {
      setError("Failed to load apps");
      console.error("Error fetching apps:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleBackToCountries = () => {
    setSelectedCountry(null);
    setApps([]);
    setAppSearch("");
    setCountrySearch("");
    setError(null);
  };

  const handleAddToCart = (app: App) => {
    if (!selectedCountry) return;

    // Store cart context in localStorage for checkout page
    localStorage.setItem(
      "accthive_cart",
      JSON.stringify({
        serviceType: "sms-service",
        externalId: `sms_${selectedCountry.id}_${app.id}`,
        serviceName: `${app.full_name} (${selectedCountry.full_name})`,
        serviceDescription: `SMS Verification for ${app.full_name} in ${selectedCountry.full_name}`,
        price: parseFloat(app.deduct),
        meta: {
          appId: app.id,
          appName: app.full_name,
          countryId: selectedCountry.id,
          countryName: selectedCountry.full_name,
          deduct: app.deduct,
        },
      })
    );
    router.push("/checkout");
  };

  // Filtered lists
  const filteredCountries = countries.filter((c) =>
    c.full_name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const filteredApps = apps.filter((a) =>
    a.full_name.toLowerCase().includes(appSearch.toLowerCase()),
  );

  return (
    <main className="flex-1 flex flex-col items-center px-4 md:px-10 pb-16">
      <div className="w-full max-w-7xl flex flex-col">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              {selectedCountry
                ? `${selectedCountry.full_name} - SMS Services`
                : "SMS Verification Service"}
            </h1>
            <p className="text-gray-500 dark:text-[#a39cba] text-lg font-normal">
              {selectedCountry
                ? `Select an app to receive SMS verification codes from ${selectedCountry.full_name}`
                : "Choose a country to get started with SMS verification services"}
            </p>
          </div>
          <div className="flex gap-3">
            {selectedCountry && (
              <button
                onClick={handleBackToCountries}
                className="flex items-center justify-center rounded-full h-12 px-6 bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#3d384e] text-gray-900 dark:text-white font-bold transition-all border border-gray-200 dark:border-white/5 cursor-pointer"
              >
                <span className="material-symbols-outlined mr-2 text-[20px]">
                  arrow_back
                </span>
                Back to Countries
              </button>
            )}
            <button className="flex items-center justify-center rounded-full h-12 px-6 bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#3d384e] text-gray-900 dark:text-white font-bold transition-all border border-gray-200 dark:border-white/5 cursor-pointer">
              <span className="material-symbols-outlined mr-2 text-[20px]">
                history
              </span>
              Recent SMS
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-3xl">
                public
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase">
                Countries
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {loadingCountries ? "..." : countries.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Available worldwide</p>
          </div>
          <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-green-500 text-3xl">
                bolt
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase">
                Delivery
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              Instant
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Receive codes in seconds
            </p>
          </div>
          <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-blue-500 text-3xl">
                verified_user
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase">
                {selectedCountry ? "Apps Available" : "Success Rate"}
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {selectedCountry ? (loadingApps ? "..." : apps.length) : "99%"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {selectedCountry ? "Services ready" : "Reliable verification"}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Countries Grid */}
        {!selectedCountry && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Select a Country
              </h2>
              <div className="relative w-full md:w-72">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search country..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full h-11 pl-12 pr-4 rounded-full border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#1d1a27] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            {loadingCountries ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] animate-pulse"
                  >
                    <div className="w-16 h-16 bg-gray-200 dark:bg-[#2c2839] rounded-xl mb-4 mx-auto" />
                    <div className="h-4 bg-gray-200 dark:bg-[#2c2839] rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredCountries.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => handleCountrySelect(country)}
                    className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] hover:border-primary dark:hover:border-primary transition-all cursor-pointer group text-center"
                  >
                    {country.picture && (
                      <img
                        src={country.picture}
                        alt={country.full_name}
                        className="w-16 h-16 rounded-xl object-cover mx-auto mb-3 group-hover:scale-110 transition-transform"
                      />
                    )}
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {country.full_name}
                    </h3>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Apps Grid */}
        {selectedCountry && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Available Apps
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                  <img
                    src={selectedCountry.picture}
                    alt={selectedCountry.full_name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                    {selectedCountry.full_name}
                  </span>
                </div>
              </div>

              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder={`Search apps in ${selectedCountry.full_name}...`}
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#1d1a27] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {loadingApps ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] animate-pulse"
                  >
                    <div className="w-16 h-16 bg-gray-200 dark:bg-[#2c2839] rounded-xl mb-4" />
                    <div className="h-6 bg-gray-200 dark:bg-[#2c2839] rounded mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-[#2c2839] rounded w-20" />
                  </div>
                ))}
              </div>
            ) : filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] hover:border-primary dark:hover:border-primary transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      {(app.picture || app.link) && (
                        <img
                          src={app.picture || app.link}
                          alt={app.full_name}
                          className="w-16 h-16 rounded-xl object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      {app.trending === 1 && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                          Trending
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {app.full_name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${app.deduct}
                      </span>
                      <button
                        onClick={() => handleAddToCart(app)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
                  apps
                </span>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No apps available for {selectedCountry.full_name}
                </p>
                <button
                  onClick={handleBackToCountries}
                  className="text-primary hover:underline font-medium"
                >
                  Try another country
                </button>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 w-full rounded-3xl bg-[#2c2839] p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Need Bulk SMS Services?
              </h2>
              <p className="text-[#a39cba] text-lg">
                Contact our enterprise team for custom solutions and volume
                discounts. Perfect for agencies and businesses.
              </p>
            </div>
            <button className="flex shrink-0 items-center justify-center rounded-full h-14 px-8 bg-white hover:bg-gray-100 text-background-dark font-extrabold text-lg transition-transform hover:scale-105 cursor-pointer">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
