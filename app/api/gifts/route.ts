import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get user's gifts
    const [gifts, total] = await Promise.all([
      prisma.gift.findMany({
        where: { userId: authUser.userId },
        include: {
          service: {
            select: {
              name: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.gift.count({
        where: { userId: authUser.userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: gifts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get gifts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gifts" },
      { status: 500 },
    );
  }
}
