import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, ServiceResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    const formattedService: ServiceResponse = {
      id: service.id,
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      isActive: service.isActive,
    };

    return NextResponse.json<ApiResponse<ServiceResponse>>(
      { success: true, data: formattedService },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get service by ID error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
