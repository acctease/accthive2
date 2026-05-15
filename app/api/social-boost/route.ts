import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";
import https from "https";

interface AirSMMService {
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

async function fetchServices(): Promise<AirSMMService[]> {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      key: "eadc6c67bf248b9bb15679f3153878ae",
      action: "services",
    }).toString();

    const options = {
      hostname: "airsmm.com",
      path: "/api/v2",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
        "User-Agent": "AccThive/1.0",
      },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const services = JSON.parse(data);
          resolve(services);
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

    req.write(postData);
    req.end();
  });
}

export async function GET(request: NextRequest) {
  try {
    const services = await fetchServices();

    return NextResponse.json<ApiResponse<AirSMMService[]>>(
      { success: true, data: services },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching social boost services:", error);

    // Handle timeout specifically
    if (error.message === "Request timeout") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Request timeout - AirSMM API is not responding",
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
