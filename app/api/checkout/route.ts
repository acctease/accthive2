import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { ApiResponse, CheckoutResponse } from "@/types/api";

// ─────────────────────────────────────────────
// External service fulfilment handlers
// Replace placeholder bodies with real API calls
// once you share the endpoints.
// ─────────────────────────────────────────────

async function fulfilSmsService(payload: {
  orderId: string;
  externalId: string;
  meta: Record<string, any>;
}) {
  // TODO: call PVAPins buy endpoint
  console.log("[sms-service] Fulfil:", payload.orderId, payload.meta);
  // e.g. await fetch("https://api.pvapins.com/user/api/buy.php?country_id=...&app_id=...")
}

async function fulfilSocialBoost(payload: {
  orderId: string;
  externalId: string;
  meta: Record<string, any>;
}) {
  // TODO: call AirSMM order endpoint
  console.log("[social-boost] Fulfil:", payload.orderId, payload.meta);
  // e.g. await fetch("https://airsmm.com/api/v2", { method: "POST", body: "key=...&action=add&service=..." })
}

async function fulfilSocialAccounts(payload: {
  orderId: string;
  externalId: string;
  meta: Record<string, any>;
}) {
  // TODO: call MuaViaMeta buy endpoint
  console.log("[social-accounts] Fulfil:", payload.orderId, payload.meta);
  // e.g. await fetch("https://muaviameta.com/api/buy.php?api_key=...&product_id=...")
}

async function fulfilOrder(
  serviceType: string,
  payload: { orderId: string; externalId: string; meta: Record<string, any> }
) {
  switch (serviceType) {
    case "sms-service":
      await fulfilSmsService(payload);
      break;
    case "social-boost":
      await fulfilSocialBoost(payload);
      break;
    case "social-accounts":
      await fulfilSocialAccounts(payload);
      break;
    default:
      console.warn("[checkout] Unknown serviceType:", serviceType);
  }
}

// ─────────────────────────────────────────────
// POST /api/checkout
// Body: { serviceType, externalId, serviceName, serviceDescription, price, meta, details? }
// ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);

    const body = await request.json();
    const {
      serviceType,
      externalId,
      serviceName,
      serviceDescription,
      price,
      meta = {},
      details = {},
    } = body as {
      serviceType: string;
      externalId: string;
      serviceName: string;
      serviceDescription?: string;
      price: number;
      meta?: Record<string, any>;
      details?: Record<string, any>;
    };

    // Validate required fields
    if (!serviceType || !externalId || !serviceName || price === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "serviceType, externalId, serviceName and price are required" },
        { status: 400 }
      );
    }

    // Get user's wallet
    const wallet = await prisma.wallet.findFirst({
      where: { userId: authUser.userId },
    });

    if (!wallet) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Wallet not found" },
        { status: 404 }
      );
    }

    // Check balance
    if (wallet.balance < price) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Insufficient balance",
          data: {
            required: price,
            available: wallet.balance,
            shortfall: price - wallet.balance,
          },
        },
        { status: 400 }
      );
    }

    // Deduct wallet + create order + create transaction atomically
    const [updatedWallet, order] = await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: price } },
      }),
      prisma.order.create({
        data: {
          userId: authUser.userId,
          // No serviceId — external service, not in our DB
          serviceName,
          serviceType,
          servicePrice: price,
          amount: price,
          status: "PROCESSING",
          details: {
            ...details,
            externalId,
            serviceDescription: serviceDescription || "",
            meta,
          },
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: "PAYMENT",
          amount: price,
          description: `Payment for ${serviceName}`,
        },
      }),
    ]);

    // Fire external fulfilment (non-blocking)
    try {
      await fulfilOrder(serviceType, {
        orderId: order.id,
        externalId,
        meta,
      });
    } catch (fulfilErr) {
      console.error("[checkout] Fulfilment error (order still created):", fulfilErr);
    }

    const response: CheckoutResponse = {
      orderId: order.id,
      amount: price,
      newBalance: updatedWallet.balance,
      status: order.status,
    };

    return NextResponse.json<ApiResponse<CheckoutResponse>>(
      { success: true, data: response, message: "Checkout successful" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Checkout error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
