"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { formatINR } from "@/lib/types";
import type { Product } from "@/lib/types";

/**
 * Product list with optimistic toggles: the UI updates the instant you
 * click, and the change syncs to Supabase in the background.
 * If the sync fails, the UI rolls back and shows the error.
 */
export default function ProductTable({ products: initial }: { products: Product[] }) {
  const [items, setItems] = useState<Product[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = (p: Product, field: "is_active" | "is_featured") => {
    const next = !p[field];
    // 1. Update UI instantly
    setItems((list) => list.map((x) => (x.id === p.id ? { ...x, [field]: next } : x)));
    // 2. Sync in background
    (async () => {
      try {
        const sb = getSupabaseBrowser();
        const { error } = await sb.from("products").update({ [field]: next }).eq("id", p.id);
        if (error) throw error;
      } catch (e) {
        // 3. Roll back on failure
        setItems((list) => list.map((x) => (x.id === p.id ? { ...x, [field]: p[field] } : x)));
        alert(e instanceof Error ? e.message : "Failed to update");
      }
    })();
  };

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusy(p.id);
    // Remove from UI instantly for a snappy feel
    setItems((list) => list.filter((x) => x.id !== p.id));
    try {
      const sb = getSupabaseBrowser();
      try {
        const { data: files } = await sb.storage.from("product-images").list(p.id);
        if (files && files.length > 0) {
          await sb.storage.from("product-images").remove(files.map((f) => `${p.id}/${f.name}`));
        }
      } catch {
        /* ignore storage errors */
      }
      const { error } = await sb.from("products").delete().eq("id", p.id);
      if (error) throw error;
    } catch (e) {
      // Roll back on failure
      setItems((list) => {
        const restored = [...list, p].sort((a, b) => (a.sort_order - b.sort_order) || (a.name < b.name ? -1 : 1));
        return restored;
      });
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white border border-line rounded-2xl px-6 py-16 text-center shadow-[0_2px_10px_rgba(74,51,37,.05)]">
        <div className="text-5xl mb-4">🪑</div>
        <p className="font-display text-2xl text-bark mb-2">No products yet</p>
        <p className="text-sm text-muted mb-6">Add your first handcrafted piece to the store.</p>
        <Link
          href="/admin/products/new"
          className="inline-block bg-gradient-to-br from-gold to-golddeep text-white text-sm font-bold px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(154,115,38,.35)] hover:-translate-y-px transition-all"
        >
          + Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(74,51,37,.05)]">
      <div className="overflow-x-auto nice-scroll">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="bg-[#F6F0E1] text-left text-[11px] uppercase tracking-wider text-bark">
              <th className="px-5 py-3.5 font-extrabold">Product</th>
              <th className="px-5 py-3.5 font-extrabold">Category</th>
              <th className="px-5 py-3.5 font-extrabold">Price</th>
              <th className="px-5 py-3.5 font-extrabold">Status</th>
              <th className="px-5 py-3.5 font-extrabold">Featured</th>
              <th className="px-5 py-3.5 font-extrabold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-[#F0E8D6] hover:bg-[#FCFAF4] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="w-11 h-11 rounded-xl object-cover flex-none border border-line" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7A5230] to-[#3E2A1A] flex-none flex items-center justify-center text-white font-display font-bold">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-semibold text-ink">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted">{p.categories?.name || "—"}</td>
                <td className="px-5 py-3 font-bold text-walnut whitespace-nowrap">
                  {formatINR(p.price)}
                  {p.mrp && p.mrp > p.price && (
                    <span className="block text-[11px] font-normal text-muted line-through">
                      {formatINR(p.mrp)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggle(p, "is_active")}
                    title="Click to toggle live / hidden"
                    className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer ${
                      p.is_active
                        ? "bg-[#E3F5E9] text-[#177A3E] hover:bg-[#D2EDDC]"
                        : "bg-[#F3E8DC] text-golddeep hover:bg-[#EADDC8]"
                    }`}
                  >
                    {p.is_active ? "● Live" : "○ Hidden"}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggle(p, "is_featured")}
                    title="Click to toggle featured on homepage"
                    className="text-xl transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                  >
                    {p.is_featured ? "⭐" : "☆"}
                  </button>
                </td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-golddeep font-bold text-[13px] hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    disabled={busy === p.id}
                    onClick={() => remove(p)}
                    className="text-red-700 font-bold text-[13px] hover:underline disabled:opacity-40 cursor-pointer"
                  >
                    {busy === p.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
