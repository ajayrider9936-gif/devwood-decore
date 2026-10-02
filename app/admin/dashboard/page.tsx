import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin";
import { formatINR } from "@/lib/types";

export default async function DashboardPage() {
  const { sb, user } = await requireAdmin();

  const [pTotal, pActive, pFeatured, cTotal, recent] = await Promise.all([
    sb.from("products").select("*", { count: "exact", head: true }),
    sb.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    sb.from("products").select("*", { count: "exact", head: true }).eq("is_featured", true),
    sb.from("categories").select("*", { count: "exact", head: true }),
    sb
      .from("products")
      .select("id,name,price,is_active,created_at,categories(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    ["Total Products", pTotal.count ?? 0, "🛋️"],
    ["Live on Website", pActive.count ?? 0, "🌐"],
    ["Categories", cTotal.count ?? 0, "🗂️"],
    ["Featured", pFeatured.count ?? 0, "⭐"],
  ];

  return (
    <AdminShell email={user.email || ""}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-walnut">Dashboard</h1>
        <Link
          href="/admin/products/new"
          className="bg-gradient-to-br from-gold to-golddeep text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-95"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(([label, n, icon]) => (
          <div key={label as string} className="bg-white border border-line rounded-2xl p-5">
            <div className="text-2xl">{icon}</div>
            <div className="text-3xl font-extrabold text-walnut mt-1">{n as number}</div>
            <div className="text-xs font-semibold text-muted mt-1">{label as string}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <h2 className="font-bold text-walnut">Recent Products</h2>
          <Link href="/admin/products" className="text-sm font-bold text-golddeep hover:underline">
            View all →
          </Link>
        </div>
        {(recent.data || []).length === 0 ? (
          <p className="px-6 py-10 text-center text-muted text-sm">
            No products yet.{" "}
            <Link href="/admin/products/new" className="text-golddeep font-bold hover:underline">
              Add your first product
            </Link>
            .
          </p>
        ) : (
          (recent.data || []).map((p: { id: string; name: string; price: number; is_active: boolean; categories: { name: string }[] | null }) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-6 py-3.5 border-b border-[#F0E8D6] last:border-0 text-sm"
            >
              <div>
                <span className="font-semibold text-ink">{p.name}</span>
                <span className="text-muted text-xs ml-3">{p.categories?.[0]?.name || "—"}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-walnut">{formatINR(p.price)}</span>
                <span
                  className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                    p.is_active ? "bg-[#E3F5E9] text-[#177A3E]" : "bg-[#F3E8DC] text-golddeep"
                  }`}
                >
                  {p.is_active ? "Live" : "Hidden"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}
