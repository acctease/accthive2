import { NextRequest, NextResponse } from "next/server";
import transData from "../../../lib/trans_data.json";

interface Product {
  id: string;
  name: string;
  price: string;
  amount: number;
  description: string;
  flag: any;
  min: string;
  max: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  products: Product[];
}

interface ApiResponse {
  status: string;
  msg: string;
  categories: Category[];
}

export async function GET(request: NextRequest) {
  try {
    // Keep the API code for reference (commented out)
    // const apiKey = "528a79c729085e499453d5988ed48e15fnW4tPCZ3lNcmjFxdJsykzo1avVLBe5Q";
    // const apiUrl = `https://muaviameta.com/api/products.php?api_key=${apiKey}`;
    // const response = await fetch(apiUrl, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // if (!response.ok) {
    //   throw new Error(`External API error: ${response.status}`);
    // }
    // const data = await response.json();

    // Use data from trans_data.json instead
    const data = transData as unknown as ApiResponse;

    if (data.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          error: data.msg || "Failed to fetch social accounts",
        },
        { status: 400 }
      );
    }

    // Limit to first 8 categories
    if (data.categories && Array.isArray(data.categories)) {
      data.categories = data.categories;
    }

    // Extract social accounts from categories
    const socialAccounts: any[] = [];
    
    if (data.categories && Array.isArray(data.categories)) {
      data.categories.forEach((category: Category) => {
        if (category.products && Array.isArray(category.products)) {
          category.products.forEach((product: Product) => {
            socialAccounts.push({
              id: product.id,
              name: product.name,
              price: product.price,
              amount: product.amount,
              description: product.description,
              min: product.min,
              max: product.max,
              flag: product.flag,
              category: category.name,
              categoryId: category.id,
              icon: category.icon,
            });
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: socialAccounts,
      total: socialAccounts.length,
    });
  } catch (error) {
    console.error("Error fetching social accounts:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch social accounts",
      },
      { status: 500 }
    );
  }
}
