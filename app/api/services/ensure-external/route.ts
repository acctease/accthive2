import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { externalId, name, category, description, price } = body;

    if (!externalId || !name || !category || price === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create the service using upsert for atomicity
    const service = await prisma.service.upsert({
      where: { externalId },
      update: {
        name,
        price: parseFloat(price.toString()),
        description: description || "",
      },
      create: {
        externalId,
        name,
        category,
        description: description || "",
        price: parseFloat(price.toString()),
        isActive: true,
      },
    });

    return NextResponse.json<ApiResponse>(
      { 
        success: true, 
        data: { serviceId: service.id },
        message: "Service ensured successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ensure external service error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
