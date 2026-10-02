import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";

export default async function NewProductPage() {
  const { sb, user } = await requireAdmin();
  const { data: cats } = await sb.from("categories").select("*").order("sort_order").order("name");

  return (
    <AdminShell email={user.email || ""}>
      <p className="text-sm text-muted mb-4">
        <Link href="/admin/products" className="hover:text-golddeep">← Products</Link>
      </p>
      <h1 className="font-display text-3xl font-bold text-walnut mb-6">Add Product</h1>
      <ProductForm product={null} categories={(cats as Category[]) || []} />
    </AdminShell>
  );
}
