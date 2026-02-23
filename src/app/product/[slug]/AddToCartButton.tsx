"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";

interface AddToCartButtonProps {
  productId: string;
  variantId: number;
}

export default function AddToCartButton({ productId, variantId }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);
    setJustAdded(false);
    const success = await addToCart(productId, variantId);
    setIsAdding(false);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdding}
      className={`mt-10 w-full rounded-xl px-8 py-4 text-lg font-semibold text-white transition hover:shadow-lg active:scale-[0.98] lg:w-auto disabled:cursor-wait disabled:opacity-60 ${
        justAdded
          ? "bg-green-600 hover:bg-green-700"
          : "bg-violet-600 hover:bg-violet-700"
      }`}
    >
      {isAdding ? "Adding to Cart..." : justAdded ? "✓ Added to Cart!" : "Add to Cart"}
    </button>
  );
}
