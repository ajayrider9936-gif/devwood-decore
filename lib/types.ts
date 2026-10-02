export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string | null;
  category_id: string | null;
  price: number;
  mrp: number | null;
  badge: string | null;
  wood_type: string | null;
  dimensions: string | null;
  finish: string | null;
  description: string | null;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  categories?: { name: string; slug: string } | null;
};

export type Settings = Record<string, string>;

export const PRODUCT_PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#7A5230,#3E2A1A)",
  "linear-gradient(135deg,#96703F,#4E3520)",
  "linear-gradient(135deg,#5E6B4A,#2E3626)",
  "linear-gradient(135deg,#8A5E6E,#472E38)",
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatINR(n: number | null | undefined): string {
  if (n == null) return "";
  return "₹" + Number(n).toLocaleString("en-IN");
}
