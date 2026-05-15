import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type {
  ApiResponse,
  CreateOrderRequest,
  OrderResponse,
} from "@/types/api";

// GET - List user orders
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = requireAuth(request);

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: authUser.userId },
        include: {
          service: {
            select: { name: true, category: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId: authUser.userId } }),
    ]);

    const formattedOrders: OrderResponse[] = orders.map((o) => {
      // Cast needed until TS server reloads Prisma-generated types
      // that include the new serviceName / serviceType fields
      const order = o as typeof o & {
        serviceName?: string | null;
        serviceType?: string | null;
      };
      return {
        id: order.id,
        serviceId: order.serviceId || "",
        serviceName: order.service?.name || order.serviceName || "Unknown Service",
        amount: order.amount,
        status: order.status,
        details: order.details,
        createdAt: order.createdAt.toISOString(),
      };
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          orders: formattedOrders,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
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

    console.error("Get orders error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new order (without payment)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = requireAuth(request);

    const body: CreateOrderRequest = await request.json();
    const { serviceId, details } = body;

    // Validate input
    if (!serviceId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Service ID is required" },
        { status: 400 },
      );
    }

    // Get service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.isActive) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Service not found or inactive" },
        { status: 404 },
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: authUser.userId,
        serviceId,
        amount: service.price,
        status: "PENDING",
        details,
      },
      include: {
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    const response: OrderResponse = {
      id: order.id,
      serviceId: order.serviceId ?? undefined,
      serviceName: order.service?.name || service.name,
      amount: order.amount,
      status: order.status,
      details: order.details,
      createdAt: order.createdAt.toISOString(),
    };

    return NextResponse.json<ApiResponse<OrderResponse>>(
      { success: true, data: response, message: "Order created successfully" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    console.error("Create order error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
