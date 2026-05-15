"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceResponse } from "@/types/api";

interface ServiceListProps {
  category: string;
}

export default function ServiceList({ category }: ServiceListProps) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/${category}`);
        const data = await response.json();

        if (data.success) {
          setServices(data.data);
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
  }, [category]);

  const handlePurchase = (serviceId: string) => {
    // Navigate to gift checkout for gifting category, regular checkout for others
    if (category === "gifting") {
      router.push(`/gift-checkout?serviceId=${serviceId}`);
    } else {
      router.push(`/checkout?serviceId=${serviceId}`);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839]"
          >
            <div className="h-14 w-14 bg-gray-200 dark:bg-[#2c2839] rounded-2xl mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-[#2c2839] rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-[#2c2839] rounded mb-4 w-full"></div>
            <div className="h-10 bg-gray-200 dark:bg-[#2c2839] rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No services available
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          className="group relative flex flex-col bg-white dark:bg-[#1d1a27] rounded-2xl p-6 border border-gray-200 dark:border-[#2c2839] hover:border-primary/30 transition-all"
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">
                  star
                </span>
              </div>
              <h4 className="text-gray-900 dark:text-white text-xl font-bold mb-2">
                {service.name}
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {service.description}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Price
                </span>
                <span className="text-gray-900 dark:text-white text-2xl font-bold">
                  ${service.price.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => handlePurchase(service.id)}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {category === "gifting" ? "Send Gift" : "Purchase Now"}
                <span className="material-symbols-outlined text-sm">
                  {category === "gifting" ? "send" : "arrow_forward"}
                </span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
