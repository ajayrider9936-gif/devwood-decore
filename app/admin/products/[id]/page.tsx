import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";
import type { Category, Product } from "@/lib/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { sb, user } = await requireAdmin();
  const [{ data: product }, { data: cats }] = await Promise.all([
    sb.from("products").select("*").eq("id", id).maybeSingle(),
    sb.from("categories").select("*").order("sort_order").order("name"),
  ]);
  if (!product) notFound();

  return (
    <AdminShell email={user.email || ""}>
      <p className="text-sm text-muted mb-4">
        <Link href="/admin/products" className="hover:text-golddeep">← Products</Link>
      </p>
      <h1 className="font-display text-3xl font-bold text-walnut mb-6">Edit Product</h1>
      <ProductForm product={product as Product} categories={(cats as Category[]) || []} />
    </AdminShell>
  );
}
