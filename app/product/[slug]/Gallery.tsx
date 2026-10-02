"use client";

import { useState } from "react";
import { PRODUCT_PLACEHOLDER_GRADIENTS } from "@/lib/types";

export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images && images.length > 0 ? images : [];

  if (list.length === 0) {
    return (
      <div
        className="rounded-2xl h-[420px] flex items-center justify-center font-display text-8xl font-extrabold text-white/80"
        style={{ background: PRODUCT_PLACEHOLDER_GRADIENTS[0] }}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl overflow-hidden border border-line bg-white">
        <img src={list[active]} alt={name} className="w-full h-[420px] object-cover" />
      </div>
      {list.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto nice-scroll pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-none w-20 h-20 rounded-xl overflow-hidden border-2 ${
                i === active ? "border-gold" : "border-line"
              }`}
            >
              <img src={src} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
