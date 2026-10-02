import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";
import type { Category, Product } from "@/lib/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const [{ data: product }, { data: cats }] = await Promise.all([
    sb.from("products").select("*").eq("id", id).maybeSingle(),
    sb.from("categories").select("*").order("sort_order").order("name"),
  ]);
  if (!product) notFound();

  return (
    <div className="rise">
      <p className="text-sm text-muted mb-3">
        <Link href="/admin/products" className="hover:text-golddeep font-semibold">← Products</Link>
      </p>
      <h1 className="font-display text-3xl font-bold text-walnut mb-1">Edit Product</h1>
      <p className="text-sm text-muted mb-6">Update details — changes go live instantly.</p>
      <ProductForm product={product as Product} categories={(cats as Category[]) || []} />
    </div>
  );
}
