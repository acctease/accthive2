import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { ApiResponse, TransactionResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = requireAuth(request);

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get user's wallet
    const wallet = await prisma.wallet.findFirst({
      where: { userId: authUser.userId },
    });

    if (!wallet) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Wallet not found" },
        { status: 404 },
      );
    }

    // Get transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    const formattedTransactions: TransactionResponse[] = transactions.map(
      (t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        createdAt: t.createdAt.toISOString(),
      }),
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          transactions: formattedTransactions,
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

    console.error("Get transactions error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
