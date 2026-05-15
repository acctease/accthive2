import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { ApiResponse, WalletBalance } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = requireAuth(request);

    // Get wallet balance
    const wallet = await prisma.wallet.findFirst({
      where: { userId: authUser.userId },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!wallet) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Wallet not found" },
        { status: 404 },
      );
    }

    const response: WalletBalance = {
      walletId: wallet.id,
      balance: wallet.balance,
    };

    return NextResponse.json<ApiResponse<WalletBalance>>(
      { success: true, data: response },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    console.error("Get balance error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
