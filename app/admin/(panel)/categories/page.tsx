import CategoryManager from "@/components/admin/CategoryManager";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("categories").select("*").order("sort_order").order("name");

  return (
    <div className="rise">
      <h1 className="font-display text-3xl font-bold text-walnut mb-1">Categories</h1>
      <p className="text-sm text-muted mb-6">Organise your catalogue — drag-free, just set the display order.</p>
      <CategoryManager initial={(data as Category[]) || []} />
    </div>
  );
}
