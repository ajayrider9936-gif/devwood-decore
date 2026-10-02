import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import SectionHead from "@/components/public/SectionHead";
import { getSettings } from "@/lib/site";

export const metadata = { title: "About Us — Devwood Dekor" };

export default async function AboutPage() {
  const settings = await getSettings();
  const siteName = settings.site_name || "Devwood Dekor";
  const whatsapp = settings.whatsapp || "";
  const aboutTitle = settings.about_title || "The Art of Sardarshahar Woodcraft";
  const aboutText =
    settings.about_text ||
    "Sardarshahar, in the historic Churu district of Rajasthan, has long been revered as an epicenter of Indian hardwood craft. For centuries, the royal havelis and merchant palaces of Shekhawati stood adorned with hand-chiseled wooden doors, magnificent arches, and brass-studded timber chests that braved the harsh desert climate with unmatched dignity.";
  const aboutImage = settings.about_image || "";

  return (
    <>
      <Navbar siteName={siteName} whatsapp={whatsapp} />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
        <SectionHead title={aboutTitle} />
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {aboutImage ? (
            <img src={aboutImage} alt={aboutTitle} className="rounded-2xl border border-line w-full object-cover" />
          ) : (
            <div
              className="rounded-2xl h-80 flex items-center justify-center font-display text-7xl font-extrabold text-white/80"
              style={{ background: "linear-gradient(135deg,#6B4A2F,#241610)" }}
            >
              {siteName.charAt(0)}
            </div>
          )}
          <p className="text-[#5C4B3D] leading-8 whitespace-pre-line">{aboutText}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mt-14">
          {[
            ["🌳", "Honest Material", "Seasoned sheesham & teak — no veneer, no shortcuts."],
            ["🤲", "Artisan Made", "Carved and polished by hand, piece by piece."],
            ["🚚", "Across India", "Carefully packed and delivered to your doorstep."],
          ].map(([ic, t, d]) => (
            <div key={t} className="bg-white border border-line rounded-2xl p-6 text-center">
              <div className="text-3xl">{ic}</div>
              <h3 className="font-bold text-walnut mt-2 mb-1">{t}</h3>
              <p className="text-sm text-muted leading-6">{d}</p>
            </div>
          ))}
        </div>
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
