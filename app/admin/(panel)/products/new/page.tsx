import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";

export default async function NewProductPage() {
  const { sb } = await requireAdmin();
  const { data: cats } = await sb.from("categories").select("*").order("sort_order").order("name");

  return (
    <div className="rise">
      <p className="text-sm text-muted mb-3">
        <Link href="/admin/products" className="hover:text-golddeep font-semibold">← Products</Link>
      </p>
      <h1 className="font-display text-3xl font-bold text-walnut mb-1">Add Product</h1>
      <p className="text-sm text-muted mb-6">Fill in the details — photos upload automatically.</p>
      <ProductForm product={null} categories={(cats as Category[]) || []} />
    </div>
  );
}
