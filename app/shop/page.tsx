import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import ShopClient from "./ShopClient";
import { getSettings, getCategories, getProducts } from "@/lib/site";

export const metadata = { title: "Shop — Devwood Dekor" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const sp = await searchParams;
  const [settings, categories, products] = await Promise.all([
    getSettings(),
    getCategories(true),
    getProducts(true),
  ]);
  const siteName = settings.site_name || "Devwood Dekor";
  const whatsapp = settings.whatsapp || "";

  return (
    <>
      <Navbar siteName={siteName} whatsapp={whatsapp} />
      <ShopClient
        categories={categories}
        products={products}
        whatsapp={whatsapp}
        initialCat={sp.cat || ""}
      />
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
