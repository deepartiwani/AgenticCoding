"use client";

import { useState } from "react";
import Image from "next/image";
import type { Image as CTImage } from "@commercetools/platform-sdk";

interface ProductImagesProps {
  images: CTImage[];
  name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        <span className="text-zinc-400 dark:text-zinc-500">No image available</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={selectedImage.url}
          alt={selectedImage.label || name}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                index === selectedIndex
                  ? "border-violet-600 dark:border-violet-400"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={image.label || `${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}