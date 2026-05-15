import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { ApiResponse, DepositRequest } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = requireAuth(request);

    const body: DepositRequest & { paymentMethod?: string } =
      await request.json();
    const { amount, paymentMethod = "Unknown" } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid deposit amount" },
        { status: 400 },
      );
    }

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

    // Simulate payment processing (in real app, integrate with payment gateway)
    // For now, we'll just add the amount to the wallet

    // formatting transaction description
    const description = `Deposit of $${amount.toFixed(2)} via ${paymentMethod}`;

    // Update wallet balance and create transaction in a single transaction
    const [updatedWallet, transaction] = await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: "DEPOSIT",
          amount,
          description,
        },
      }),
    ]);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          newBalance: updatedWallet.balance,
          transaction: {
            id: transaction.id,
            amount: transaction.amount,
            type: transaction.type,
            createdAt: transaction.createdAt.toISOString(),
          },
        },
        message: "Deposit successful",
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

    console.error("Deposit error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
