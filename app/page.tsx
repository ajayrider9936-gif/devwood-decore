import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import TrustStrip from "@/components/public/TrustStrip";
import SectionHead from "@/components/public/SectionHead";
import CategoryCard from "@/components/public/CategoryCard";
import ProductCard from "@/components/public/ProductCard";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import { getSettings, getCategories, getFeaturedProducts, getNewArrivals } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase-config";
import { waLink } from "@/lib/whatsapp";
import { IconTree, IconHand, IconRuler } from "@/components/icons";

export default async function HomePage() {
  const [settings, categories, featured, newArrivals] = await Promise.all([
    getSettings(),
    getCategories(true),
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  const siteName = settings.site_name || "Devwood Dekor";
  const whatsapp = settings.whatsapp || "";
  const heroBadge = settings.hero_badge || "Authentic Rajasthani Craftsmanship";
  const heroTitle = settings.hero_title || "Timeless Solid Wood & Royal Antiques";
  const heroSubtitle =
    settings.hero_subtitle ||
    "Transform your home with generational Sheesham & Teak wood furniture and century-old restored Rajasthani artefacts, handcrafted with pride in Sardarshahar.";
  const heroImage = settings.hero_image || "";

  return (
    <>
      <Navbar siteName={siteName} whatsapp={whatsapp} />

      {/* HERO */}
      <section className="grid md:grid-cols-2 bg-ivory">
        <div className="px-6 sm:px-12 py-14 sm:py-20 flex flex-col justify-center rise">
          <span className="text-xs font-extrabold tracking-[3px] text-golddeep uppercase mb-4">
            Solid Wood Furniture
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-walnut leading-tight">
            Handcrafted Wooden Furniture,{" "}
            <em className="text-golddeep">Made for Generations</em>
          </h1>
          <p className="mt-5 text-[#5C4B3D] leading-8 max-w-lg">{heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-gradient-to-br from-gold to-golddeep text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:opacity-95"
            >
              Shop Collection
            </Link>
            {whatsapp && (
              <a
                href={waLink(whatsapp, "Hello Devwood Dekor! I want to know more about your furniture.")}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-walnut text-walnut font-bold px-8 py-3 rounded-full hover:bg-walnut hover:text-white transition-colors"
              >
                WhatsApp Us
              </a>
            )}
          </div>
        </div>
        <div className="relative min-h-[320px] md:min-h-[440px] overflow-hidden">
          {heroImage ? (
            <img src={heroImage} alt={heroTitle} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(140deg,#6B4A2F 0%,#3E2A1C 55%,#241610 100%)" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 70% 20%,rgba(194,148,58,.30),transparent 45%),radial-gradient(circle at 20% 85%,rgba(0,0,0,.45),transparent 50%)",
                }}
              />
              {/* Subtle wood-grain lines */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.14]" preserveAspectRatio="none" viewBox="0 0 400 400">
                {[30, 70, 115, 165, 220, 280, 345].map((y) => (
                  <path key={y} d={`M-20 ${y} C 80 ${y - 24}, 180 ${y + 24}, 300 ${y - 12} S 420 ${y + 8}, 440 ${y}`}
                    fill="none" stroke="#E8C97A" strokeWidth="1.6" />
                ))}
              </svg>
              <div className="absolute bottom-10 left-8 sm:left-12">
                <p className="font-display italic text-[#EFE3CC]/90 text-xl sm:text-2xl">Solid wood,</p>
                <p className="font-display text-[#EFE3CC]/90 text-xl sm:text-2xl">honest craft.</p>
              </div>
            </div>
          )}
          <span className="absolute top-6 right-6 bg-ivory text-walnut text-xs font-extrabold px-4 py-2.5 rounded-full shadow-lg">
            100% Solid Wood
          </span>
        </div>
      </section>

      <TrustStrip />

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <SectionHead title="Shop by Category" subtitle="Seven curated collections — all in solid wood" />
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {categories.map((c, i) => (
              <div key={c.id} className={`rise rise-${Math.min(i, 3)}`}>
                <CategoryCard category={c} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">
            {isSupabaseConfigured()
              ? "Categories are being added — check back soon."
              : "Connect Supabase to load categories."}
          </p>
        )}
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="bg-ivory border-t border-line">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
            <SectionHead title="Featured Pieces" subtitle="Handpicked by our artisans" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} whatsapp={whatsapp} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/shop" className="inline-block border-2 border-walnut text-walnut font-bold px-8 py-3 rounded-full hover:bg-walnut hover:text-white transition-colors">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="bg-cream border-t border-line">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
            <SectionHead title="New Arrivals" subtitle="Fresh from our workshop" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {newArrivals.map((p, i) => (
                <ProductCard key={p.id} product={p} whatsapp={whatsapp} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/shop" className="inline-block border-2 border-walnut text-walnut font-bold px-8 py-3 rounded-full hover:bg-walnut hover:text-white transition-colors">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CRAFT */}
      <section className="bg-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid gap-10 md:grid-cols-3 text-center">
          {[
            { Icon: IconTree, t: "Seasoned Timber", d: "Only mature sheesham & teak, naturally seasoned for strength." },
            { Icon: IconHand, t: "Hand Finished", d: "Every edge carved, sanded & polished by master artisans." },
            { Icon: IconRuler, t: "Made to Order", d: "Custom sizes & finishes — built exactly for your home." },
          ].map(({ Icon, t, d }) => (
            <div key={t}>
              <div className="w-14 h-14 mx-auto rounded-full bg-white border border-line shadow-[0_4px_14px_rgba(74,51,37,.08)] flex items-center justify-center">
                <Icon className="w-6 h-6 text-golddeep" />
              </div>
              <h3 className="font-display text-xl font-bold text-walnut mt-4 mb-2">{t}</h3>
              <p className="text-sm text-[#5C4B3D] leading-7 max-w-xs mx-auto">{d}</p>
            </div>
          ))}
        </div>
      </section>


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
