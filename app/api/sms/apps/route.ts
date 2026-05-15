import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";
import https from "https";

interface App {
  id: number;
  full_name: string;
  picture: string;
  timestamp: string;
  link: string;
  trending: number;
  deduct: string;
}

async function fetchApps(countryId: string): Promise<App[]> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.pvapins.com",
      path: `/user/api/load_apps.php?country_id=${countryId}`,
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
          const apps = JSON.parse(data);
          resolve(apps);
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
    const searchParams = request.nextUrl.searchParams;
    const countryId = searchParams.get("country_id");

    if (!countryId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "country_id parameter is required" },
        { status: 400 },
      );
    }

    const apps = await fetchApps(countryId);

    return NextResponse.json<ApiResponse<App[]>>(
      { success: true, data: apps },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching apps:", error);

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
