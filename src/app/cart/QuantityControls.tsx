"use client";

import React from "react";

interface QuantityControlsProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled: boolean;
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  quantity,
  onDecrease,
  onIncrease,
  disabled,
}) => (
  <div className="flex items-center gap-2">
    <button
      onClick={onDecrease}
      disabled={quantity <= 1 || disabled}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
      aria-label="Decrease quantity"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    </button>

    <span className="flex h-8 w-10 items-center justify-center text-sm font-medium text-zinc-900 dark:text-zinc-50">
      {quantity}
    </span>

    <button
      onClick={onIncrease}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
      aria-label="Increase quantity"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  </div>
);

export default QuantityControls;
