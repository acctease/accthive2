"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Service {
  service: number;
  name: string;
  type: string;
  rate: string;
  min: number;
  max: number;
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
  category: string;
}

export default function SocialBoostPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch services on mount
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const response = await fetch("/api/social-boost");
        const data = await response.json();

        if (data.success) {
          setServices(data.data);
          setFilteredServices(data.data);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.data.map((s: Service) => s.category)),
          ) as string[];
          setCategories(uniqueCategories);
        } else {
          setError(data.error || "Failed to load services");
        }
      } catch (err) {
        setError("Failed to load services");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  // Filter services by category and search query
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterServices(category, searchQuery);
  };

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterServices(selectedCategory, query);
  };

  // Combined filter function
  const filterServices = (category: string, query: string) => {
    let filtered = services;

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((s) => s.category === category);
    }

    // Filter by search query
    if (query.trim() !== "") {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerQuery) ||
          s.type.toLowerCase().includes(lowerQuery) ||
          s.category.toLowerCase().includes(lowerQuery),
      );
    }

    setFilteredServices(filtered);
  };

  const handleAddToCart = (service: Service) => {
    // Store cart context in localStorage for checkout page
    localStorage.setItem(
      "accthive_cart",
      JSON.stringify({
        serviceType: "social-boost",
        externalId: `boost_${service.service}`,
        serviceName: service.name,
        serviceDescription: `Social Boost: ${service.type} for ${service.category}`,
        price: parseFloat(service.rate),
        meta: {
          externalServiceId: service.service,
          name: service.name,
          type: service.type,
          category: service.category,
          rate: service.rate,
          min: service.min,
          max: service.max,
        },
      })
    );
    router.push("/checkout");
  };

  return (
    <main className="flex-1 flex flex-col items-center pb-16">
      <div className="w-full max-w-7xl flex flex-col px-4 md:px-10">
        {/* Hero / Heading Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Social Boost Marketplace
            </h1>
            <p className="text-gray-500 dark:text-[#a39cba] text-lg font-normal">
              Elevate your digital presence. Select a platform and service to
              instantly boost your accounts.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center rounded-full h-12 px-6 bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#3d384e] text-gray-900 dark:text-white font-bold transition-all border border-gray-200 dark:border-white/5 cursor-pointer">
              <span className="material-symbols-outlined mr-2 text-[20px]">
                history
              </span>
              Recent Orders
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-3xl">
                inventory
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase">
                Services
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : services.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Available services</p>
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
            <p className="text-sm text-gray-500 mt-1">Fast processing</p>
          </div>
          <div className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-blue-500 text-3xl">
                category
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase">
                Categories
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : categories.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Service categories</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search services by name, type, or category..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-[#2c2839] bg-white dark:bg-[#1d1a27] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="w-full min-w-0 flex gap-3 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleCategoryFilter("all")}
            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 font-bold transition-colors border cursor-pointer ${
              selectedCategory === "all"
                ? "bg-white dark:bg-white text-gray-900 dark:text-background-dark border-gray-200 dark:border-transparent"
                : "bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#3d384e] text-gray-700 dark:text-white border-gray-200 dark:border-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              grid_view
            </span>
            All Services
          </button>

          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex h-10 shrink-0 w-32 rounded-full bg-gray-100 dark:bg-[#2c2839] animate-pulse"
                />
              ))}
            </>
          ) : (
            categories.slice(0, 5).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors border cursor-pointer ${
                  selectedCategory === category
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-100 dark:bg-[#2c2839] hover:bg-gray-200 dark:hover:bg-[#3d384e] text-gray-700 dark:text-white border-gray-200 dark:border-white/5"
                }`}
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  {category.split("|")[0].trim()}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Services Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === "all"
                ? "All Services"
                : selectedCategory.split("|")[0].trim()}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredServices.length} services
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] animate-pulse"
                >
                  <div className="h-6 bg-gray-200 dark:bg-[#2c2839] rounded mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-[#2c2839] rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-[#2c2839] rounded w-20" />
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.service}
                  className="bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] hover:border-primary dark:hover:border-primary transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {service.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {service.refill && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">
                            Refill
                          </span>
                        )}
                        {service.cancel && (
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                            Cancel
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Min/Max</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {service.min.toLocaleString()} -{" "}
                        {service.max === 2147483647
                          ? "∞"
                          : service.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Type</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {service.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#2c2839]">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price per 1K</p>
                      <span className="text-2xl font-bold text-primary">
                        ${service.rate}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(service)}
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
                inventory
              </span>
              <p className="text-gray-500 dark:text-gray-400">
                No services found in this category
              </p>
            </div>
          )}
        </div>

        {/* Additional Services CTA */}
        <div className="mt-16 w-full rounded-3xl bg-[#2c2839] p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent z-0"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                  Premium Services
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Need Bulk Orders?
              </h2>
              <p className="text-[#a39cba] text-lg">
                Contact our team for custom packages, volume discounts, and
                enterprise solutions tailored to your needs.
              </p>
            </div>
            <button className="flex shrink-0 items-center justify-center rounded-full h-14 px-8 bg-white hover:bg-gray-100 text-background-dark font-extrabold text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
