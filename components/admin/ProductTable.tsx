"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { formatINR } from "@/lib/types";
import type { Product } from "@/lib/types";

export default function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (p: Product, field: "is_active" | "is_featured") => {
    setBusy(p.id);
    try {
      const sb = getSupabaseBrowser();
      const { error } = await sb.from("products").update({ [field]: !p[field] }).eq("id", p.id);
      if (error) throw error;
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusy(p.id);
    try {
      const sb = getSupabaseBrowser();
      // best-effort: remove its storage folder too
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
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white border border-line rounded-2xl px-6 py-16 text-center">
        <p className="font-display text-2xl text-bark mb-2">No products yet</p>
        <p className="text-sm text-muted mb-6">Add your first handcrafted piece to the store.</p>
        <Link
          href="/admin/products/new"
          className="inline-block bg-gradient-to-br from-gold to-golddeep text-white text-sm font-bold px-6 py-3 rounded-full"
        >
          + Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden">
      <div className="overflow-x-auto nice-scroll">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="bg-[#F3ECDC] text-left text-xs uppercase tracking-wide text-bark">
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Featured</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[#F0E8D6] hover:bg-ivory/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="w-11 h-11 rounded-lg object-cover flex-none" />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7A5230] to-[#3E2A1A] flex-none flex items-center justify-center text-white font-display font-bold">
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
                    disabled={busy === p.id}
                    onClick={() => toggle(p, "is_active")}
                    title="Toggle live / hidden"
                    className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full ${
                      p.is_active ? "bg-[#E3F5E9] text-[#177A3E]" : "bg-[#F3E8DC] text-golddeep"
                    }`}
                  >
                    {p.is_active ? "● Live" : "○ Hidden"}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button
                    disabled={busy === p.id}
                    onClick={() => toggle(p, "is_featured")}
                    title="Toggle featured on homepage"
                    className="text-lg"
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
                    className="text-red-700 font-bold text-[13px] hover:underline"
                  >
                    Delete
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
