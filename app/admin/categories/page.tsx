import AdminShell from "@/components/admin/AdminShell";
import CategoryManager from "@/components/admin/CategoryManager";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const { sb, user } = await requireAdmin();
  const { data } = await sb.from("categories").select("*").order("sort_order").order("name");

  return (
    <AdminShell email={user.email || ""}>
      <h1 className="font-display text-3xl font-bold text-walnut mb-6">Categories</h1>
      <CategoryManager initial={(data as Category[]) || []} />
    </AdminShell>
  );
}
