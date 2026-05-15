import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";
import https from "https";

interface Country {
  id: number;
  full_name: string;
  link: string;
  picture: string;
}

async function fetchCountries(): Promise<Country[]> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.pvapins.com",
      path: "/user/api/load_countries.php",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "AccThive/1.0",
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const countries = JSON.parse(data);
          resolve(countries);
        } catch (error) {
          reject(new Error("Failed to parse response"));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

export async function GET(request: NextRequest) {
  try {
    const countries = await fetchCountries();
    
    return NextResponse.json<ApiResponse<Country[]>>(
      { success: true, data: countries },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching countries:", error);

    // Handle timeout specifically
    if (error.message === "Request timeout") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Request timeout - PVAPins API is not responding",
        },
        { status: 504 },
      );
    }

    // Handle network errors
    if (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            "Connection timeout - Please check your network or try again later",
        },
        { status: 504 },
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
