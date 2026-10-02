import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProductTable from "@/components/admin/ProductTable";
import { requireAdmin } from "@/lib/admin";
import type { Product } from "@/lib/types";

export default async function ProductsPage() {
  const { sb, user } = await requireAdmin();
  const { data } = await sb
    .from("products")
    .select("*, categories(name,slug)")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <AdminShell email={user.email || ""}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-walnut">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-gradient-to-br from-gold to-golddeep text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-95"
        >
          + Add Product
        </Link>
      </div>
      <ProductTable products={(data as Product[]) || []} />
    </AdminShell>
  );
}
