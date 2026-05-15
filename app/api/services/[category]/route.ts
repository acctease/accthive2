import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, ServiceResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ category: string }> },
) {
  try {
    const { category } = await context.params;

    // Get services by category
    const services = await prisma.service.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { price: "asc" },
    });

    const formattedServices: ServiceResponse[] = services.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      description: s.description,
      price: s.price,
      isActive: s.isActive,
    }));

    return NextResponse.json<ApiResponse<ServiceResponse[]>>(
      { success: true, data: formattedServices },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get services by category error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
