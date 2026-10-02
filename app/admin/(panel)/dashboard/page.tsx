import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatINR } from "@/lib/types";

export default async function DashboardPage() {
  const { sb } = await requireAdmin();

  // One products query feeds all three product stats (fewer round-trips).
  const [prodRows, cTotal, recent] = await Promise.all([
    sb.from("products").select("id,is_active,is_featured"),
    sb.from("categories").select("*", { count: "exact", head: true }),
    sb
      .from("products")
      .select("id,name,price,is_active,images,created_at,categories(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const products = prodRows.data || [];
  const stats = [
    { label: "Total Products", n: products.length, icon: "🛋️", bg: "from-[#C2943A] to-[#9A7326]" },
    { label: "Live on Website", n: products.filter((p) => p.is_active).length, icon: "🌐", bg: "from-[#1FA855] to-[#147A3E]" },
    { label: "Categories", n: cTotal.count ?? 0, icon: "🗂️", bg: "from-[#7A5230] to-[#4A3325]" },
    { label: "Featured", n: products.filter((p) => p.is_featured).length, icon: "⭐", bg: "from-[#E0A93E] to-[#B07E1F]" },
  ];

  return (
    <div className="rise">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-walnut">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Welcome back — here&apos;s your store at a glance.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-gradient-to-br from-gold to-golddeep text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-95 shadow-[0_4px_14px_rgba(154,115,38,.35)] transition-all hover:-translate-y-px active:translate-y-0"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`rise rise-${i} bg-white border border-line rounded-2xl p-5 shadow-[0_2px_10px_rgba(74,51,37,.05)] hover:shadow-[0_8px_24px_rgba(74,51,37,.10)] hover:-translate-y-0.5 transition-all`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center text-lg shadow-sm`}>
              {s.icon}
            </div>
            <div className="text-3xl font-extrabold text-walnut mt-3 tabular-nums">{s.n}</div>
            <div className="text-xs font-semibold text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(74,51,37,.05)]">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-[#FCFAF4]">
          <h2 className="font-bold text-walnut">Recent Products</h2>
          <Link href="/admin/products" className="text-sm font-bold text-golddeep hover:underline">
            View all →
          </Link>
        </div>
        {(recent.data || []).length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="text-4xl mb-3">🪑</div>
            <p className="font-display text-xl text-bark mb-1">No products yet</p>
            <p className="text-sm text-muted mb-5">Add your first handcrafted piece to get started.</p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-gradient-to-br from-gold to-golddeep text-white text-sm font-bold px-6 py-2.5 rounded-full"
            >
              + Add Product
            </Link>
          </div>
        ) : (
          (recent.data || []).map((p: { id: string; name: string; price: number; is_active: boolean; images: string[] | null; categories: { name: string }[] | null }) => (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="flex items-center gap-4 px-6 py-3.5 border-b border-[#F0E8D6] last:border-0 text-sm hover:bg-[#FCFAF4] transition-colors group"
            >
              {p.images?.[0] ? (
                <img src={p.images[0]} alt="" className="w-11 h-11 rounded-xl object-cover flex-none border border-line" />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7A5230] to-[#3E2A1A] flex-none flex items-center justify-center text-white font-display font-bold border border-line">
                  {p.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-ink group-hover:text-golddeep transition-colors block truncate">{p.name}</span>
                <span className="text-muted text-xs">{p.categories?.[0]?.name || "Uncategorized"}</span>
              </div>
              <span className="font-bold text-walnut whitespace-nowrap">{formatINR(p.price)}</span>
              <span
                className={`text-[11px] font-extrabold px-3 py-1 rounded-full flex-none ${
                  p.is_active ? "bg-[#E3F5E9] text-[#177A3E]" : "bg-[#F3E8DC] text-golddeep"
                }`}
              >
                {p.is_active ? "● Live" : "○ Hidden"}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
