import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";
import { requireAdmin } from "@/lib/admin";
import type { Product } from "@/lib/types";

export default async function ProductsPage() {
  const { sb } = await requireAdmin();
  const { data } = await sb
    .from("products")
    .select("*, categories(name,slug)")
    .order("sort_order")
    .order("created_at", { ascending: false });

  const products = (data as Product[]) || [];

  return (
    <div className="rise">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-walnut">Products</h1>
          <p className="text-sm text-muted mt-1">
            {products.length} {products.length === 1 ? "item" : "items"} in your catalogue
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-gradient-to-br from-gold to-golddeep text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-95 shadow-[0_4px_14px_rgba(154,115,38,.35)] transition-all hover:-translate-y-px active:translate-y-0"
        >
          + Add Product
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
