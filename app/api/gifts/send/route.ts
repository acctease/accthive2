import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      amount,
      recipientName,
      recipientEmail,
      recipientPhone,
      recipientCountry,
      recipientCity,
      recipientAddress,
      message,
      deliveryMethod,
    } = body;

    // Validate required fields
    if (
      !amount ||
      !recipientName ||
      !recipientEmail ||
      !recipientCountry ||
      !deliveryMethod
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate amount
    const giftAmount = parseFloat(amount);
    if (isNaN(giftAmount) || giftAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid gift amount" },
        { status: 400 },
      );
    }

    // Validate delivery method
    const validDeliveryMethods = ["EMAIL", "SMS", "WHATSAPP"];
    if (!validDeliveryMethods.includes(deliveryMethod)) {
      return NextResponse.json(
        { success: false, error: "Invalid delivery method" },
        { status: 400 },
      );
    }

    // Get user's wallet
    const wallet = await prisma.wallet.findFirst({
      where: { userId: authUser.userId },
    });

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "Wallet not found" },
        { status: 404 },
      );
    }

    // Check if user has sufficient balance
    if (wallet.balance < giftAmount) {
      return NextResponse.json(
        { success: false, error: "Insufficient balance" },
        { status: 400 },
      );
    }

    // Process gift sending in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct amount from wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance - giftAmount },
      });

      // Create gift record
      const gift = await tx.gift.create({
        data: {
          userId: authUser.userId,
          recipientName,
          recipientEmail,
          recipientPhone,
          recipientCountry,
          recipientCity,
          recipientAddress,
          message,
          amount: giftAmount,
          status: "SENT",
          deliveryMethod,
          sentAt: new Date(),
        },
      });

      // Fetch "Gifting" service or use a placeholder ID
      // For now, we'll try to find a service with category "gifting" or create a dummy relation if strictly needed.
      // However, Order requires serviceId.
      let service = await tx.service.findFirst({
        where: { category: "gifting" },
      });

      if (!service) {
        // Create a default gifting service if it doesn't exist (Handling edge case)
        service = await tx.service.create({
          data: {
            name: "Global Gift",
            category: "gifting",
            description: "International money gift",
            price: 0, // Variable price
            isActive: true,
          },
        });
      }

      // Create Order record linked to this gift (via details)
      await tx.order.create({
        data: {
          userId: authUser.userId,
          serviceId: service.id,
          amount: giftAmount,
          status: "PROCESSING", // Use PROCESSING to show tracking
          details: {
            giftId: gift.id,
            recipientName,
            recipientEmail,
            recipientCountry,
            deliveryMethod,
            message,
            sentAt: new Date().toISOString(),
          },
        },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: "PAYMENT",
          amount: giftAmount,
          description: `Gift: $${giftAmount.toFixed(2)} to ${recipientName}`,
        },
      });

      return { gift, wallet: updatedWallet };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Gift send error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send gift",
      },
      { status: 500 },
    );
  }
}
