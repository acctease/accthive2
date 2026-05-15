import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Verify authentication
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    // Get gift details
    const gift = await prisma.gift.findUnique({
      where: { id },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!gift) {
      return NextResponse.json(
        { success: false, error: "Gift not found" },
        { status: 404 },
      );
    }

    // Verify the gift belongs to the authenticated user
    if (gift.userId !== authUser.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      data: gift,
    });
  } catch (error) {
    console.error("Get gift details error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gift details" },
      { status: 500 },
    );
  }
}
