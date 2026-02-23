import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/commercetools";

import { getLocalizedString } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const { results } = await searchProducts(q, 5, 0, undefined, false);

    const suggestions = results.map((product) => {
      const price = product.masterVariant.price ?? product.masterVariant.prices?.[0];
      let formattedPrice: string | undefined;
      if (price) {
        formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: price.value.currencyCode,
        }).format(price.value.centAmount / Math.pow(10, price.value.fractionDigits));
      }

      return {
        id: product.id,
        name: getLocalizedString(product.name),
        slug: getLocalizedString(product.slug),
        image: product.masterVariant.images?.[0]?.url ?? null,
        price: formattedPrice ?? null,
      };
    });

    return NextResponse.json({ results: suggestions });
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json({ results: [] });
  }
}
