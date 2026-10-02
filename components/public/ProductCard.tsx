import Link from "next/link";
import { formatINR, PRODUCT_PLACEHOLDER_GRADIENTS } from "@/lib/types";
import type { Product } from "@/lib/types";
import { waLink, productEnquiryMessage } from "@/lib/whatsapp";

export default function ProductCard({
  product,
  whatsapp,
  index = 0,
}: {
  product: Product;
  whatsapp: string;
  index?: number;
}) {
  const href = `/product/${product.slug || product.id}`;
  const img = product.images?.[0];
  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
      <Link href={href} className="block relative">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-52 object-cover" loading="lazy" />
        ) : (
          <div
            className="w-full h-52 flex items-center justify-center font-display text-6xl font-extrabold text-white/80"
            style={{ background: PRODUCT_PLACEHOLDER_GRADIENTS[index % 4] }}
          >
            {product.name.charAt(0)}
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gold text-white text-[11px] font-bold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {product.is_new_arrival && (
          <span className={`absolute ${product.badge ? "top-11" : "top-3"} left-3 bg-[#1FA855] text-white text-[11px] font-extrabold px-3 py-1 rounded-full tracking-wide`}>
            NEW
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-walnut text-white text-[11px] font-bold px-3 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={href}>
          <h3 className="font-bold text-walnut hover:text-golddeep line-clamp-2">{product.name}</h3>
        </Link>
        {product.categories?.name && (
          <p className="text-[11px] text-golddeep font-bold uppercase tracking-wider mt-1">
            {product.categories.name}
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-walnut">{formatINR(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-muted line-through ml-2">{formatINR(product.mrp)}</span>
            )}
          </div>
          {whatsapp && (
            <a
              href={waLink(whatsapp, productEnquiryMessage(product.name, product.price))}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-leaf border-[1.5px] border-leaf px-3.5 py-1.5 rounded-full hover:bg-leaf hover:text-white transition-colors"
            >
              Enquire
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
