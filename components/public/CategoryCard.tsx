import Link from "next/link";
import type { Category } from "@/lib/types";

const SUBTITLES: Record<string, string> = {
  "wall-clock": "Handcrafted wooden clocks",
  bed: "Sheesham & teak beds",
  jhula: "Traditional indoor swings",
  "dining-table": "4 & 6 seater sets",
  telephone: "Vintage wooden pieces",
  "electronic-items": "Wooden-finish appliances",
  "kitchen-items": "Racks, boxes & holders",
};

export default function CategoryCard({ category }: { category: Category }) {
  const initial = category.name.charAt(0).toUpperCase();
  return (
    <Link
      href={`/shop?cat=${category.slug}`}
      className="group bg-white border border-line rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all"
    >
      {category.image_url ? (
        <img
          src={category.image_url}
          alt={category.name}
          className="w-16 h-16 rounded-full object-cover mx-auto mb-4 ring-2 ring-gold"
          loading="lazy"
        />
      ) : (
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center font-display text-3xl font-extrabold text-golddeep bg-[radial-gradient(circle_at_35%_30%,#FFF8E8,#F0E2C4)] border-2 border-gold">
          {initial}
        </div>
      )}
      <h3 className="font-bold text-walnut group-hover:text-golddeep">{category.name}</h3>
      <p className="text-xs text-muted mt-1.5">{SUBTITLES[category.slug] || "Explore collection"}</p>
    </Link>
  );
}
