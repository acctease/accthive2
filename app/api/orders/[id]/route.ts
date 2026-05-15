import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { ApiResponse, OrderResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Verify authentication
    const authUser = requireAuth(request);
    const { id } = await context.params;

    // Get order with service details
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        service: {
          select: {
            name: true,
            category: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // Verify ownership
    if (order.userId !== authUser.userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    const response: OrderResponse = {
      id: order.id,
      serviceId: order.serviceId ?? undefined,
      serviceName: order.service?.name || (order as any).serviceName || "Unknown Service",
      amount: order.amount,
      status: order.status,
      details: order.details,
      createdAt: order.createdAt.toISOString(),
    };

    // We'll add category to the response data directly as an extra field
    const extendedResponse = {
      ...response,
      serviceCategory: order.service?.category ?? (order as any).serviceType ?? null,
    };

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: extendedResponse,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    console.error("Get order error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
