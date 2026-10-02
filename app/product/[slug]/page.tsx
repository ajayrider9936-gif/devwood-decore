import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import ProductCard from "@/components/public/ProductCard";
import { getSettings, getProductBySlug, getProducts } from "@/lib/site";
import { formatINR } from "@/lib/types";
import { waLink, productEnquiryMessage } from "@/lib/whatsapp";
import { IconWhatsApp } from "@/components/icons";
import Gallery from "./Gallery";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, product] = await Promise.all([getSettings(), getProductBySlug(slug)]);
  if (!product) notFound();

  const siteName = settings.site_name || "Devwood Dekor";
  const whatsapp = settings.whatsapp || "";
  const all = await getProducts(true);
  const related = all
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4);

  const specs: [string, string | null][] = [
    ["Wood", product.wood_type],
    ["Dimensions", product.dimensions],
    ["Finish", product.finish],
    ["Category", product.categories?.name || null],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <>
      <Navbar siteName={siteName} whatsapp={whatsapp} />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <p className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-golddeep">Home</Link> /{" "}
          <Link href="/shop" className="hover:text-golddeep">Shop</Link> /{" "}
          <span className="text-bark font-semibold">{product.name}</span>
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <Gallery images={product.images || []} name={product.name} />

          <div>
            {product.badge && (
              <span className="inline-block bg-gold text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-walnut">
              {product.name}
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-walnut">{formatINR(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-muted line-through">{formatINR(product.mrp)}</span>
                  <span className="bg-walnut text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {specs.length > 0 && (
              <div className="mt-6 border border-line rounded-2xl overflow-hidden">
                {specs.map(([k, v], i) => (
                  <div key={k} className={`flex text-sm ${i % 2 ? "bg-ivory" : "bg-white"}`}>
                    <span className="w-32 px-4 py-3 font-bold text-bark">{k}</span>
                    <span className="px-4 py-3 text-ink">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {product.description && (
              <p className="mt-6 text-[#5C4B3D] leading-8 whitespace-pre-line">{product.description}</p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              {whatsapp ? (
                <a
                  href={waLink(whatsapp, productEnquiryMessage(product.name, product.price))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-leaf text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:opacity-90"
                >
                  <span className="inline-flex items-center gap-2"><IconWhatsApp className="w-5 h-5" /> Enquire on WhatsApp</span>
                </a>
              ) : (
                <span className="text-sm text-muted">Contact the store to enquire about this piece.</span>
              )}
              <Link
                href="/shop"
                className="border-2 border-walnut text-walnut font-bold px-8 py-3 rounded-full hover:bg-walnut hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-walnut mb-6">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} whatsapp={whatsapp} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer
        siteName={siteName}
        phone={settings.phone || ""}
        whatsapp={whatsapp}
        address={settings.address || ""}
        footerText={settings.footer_text || ""}
      />
      <WhatsAppFloat whatsapp={whatsapp} />
    </>
  );
}
