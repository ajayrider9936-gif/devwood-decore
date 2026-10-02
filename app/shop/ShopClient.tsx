"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/public/ProductCard";
import SectionHead from "@/components/public/SectionHead";
import type { Category, Product } from "@/lib/types";

export default function ShopClient({
  categories,
  products,
  whatsapp,
  initialCat,
}: {
  categories: Category[];
  products: Product[];
  whatsapp: string;
  initialCat: string;
}) {
  const [cat, setCat] = useState(initialCat);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const okCat = !cat || p.categories?.slug === cat;
      const okQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [products, cat, q]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <SectionHead title="Shop All Furniture" subtitle={`${filtered.length} piece${filtered.length === 1 ? "" : "s"} to explore`} />

      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCat("")}
            className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
              !cat ? "bg-walnut text-white border-walnut" : "border-line text-bark hover:border-gold"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.slug)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                cat === c.slug
                  ? "bg-walnut text-white border-walnut"
                  : "border-line text-bark hover:border-gold"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="md:ml-auto border border-line rounded-full px-5 py-2.5 text-sm bg-white w-full md:w-64"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} whatsapp={whatsapp} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="font-display text-2xl text-bark mb-2">No pieces found</p>
          <p className="text-sm">Try a different search or category.</p>
          <Link href="/" className="inline-block mt-6 text-golddeep font-bold hover:underline">
            ← Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
