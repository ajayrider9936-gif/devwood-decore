import { getSupabaseServer } from "./supabase-server";
import { isSupabaseConfigured } from "./supabase-config";
import type { Category, Product, Settings } from "./types";

export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured()) return {};
  try {
    const sb = await getSupabaseServer();
    const { data, error } = await sb.from("settings").select("key,value");
    if (error || !data) return {};
    const out: Settings = {};
    data.forEach((r: { key: string; value: string }) => (out[r.key] = r.value ?? ""));
    return out;
  } catch {
    return {};
  }
}

export async function getCategories(activeOnly = true): Promise<Category[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = await getSupabaseServer();
    let q = sb.from("categories").select("*").order("sort_order").order("name");
    if (activeOnly) q = q.eq("is_active", true);
    const { data, error } = await q;
    if (error || !data) return [];
    return data as Category[];
  } catch {
    return [];
  }
}

export async function getProducts(activeOnly = true): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = await getSupabaseServer();
    let q = sb
      .from("products")
      .select("*, categories(name,slug)")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (activeOnly) q = q.eq("is_active", true);
    const { data, error } = await q;
    if (error || !data) return [];
    return data as Product[];
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts(true);
  return all.filter((p) => p.is_featured).slice(0, 8);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = await getSupabaseServer();
    // slug match first, then fall back to id match
    let { data } = await sb
      .from("products")
      .select("*, categories(name,slug)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (!data) {
      const res = await sb
        .from("products")
        .select("*, categories(name,slug)")
        .eq("id", slug)
        .eq("is_active", true)
        .maybeSingle();
      data = res.data;
    }
    return (data as Product) || null;
  } catch {
    return null;
  }
}
