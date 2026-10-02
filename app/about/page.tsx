import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import SectionHead from "@/components/public/SectionHead";
import { getSettings } from "@/lib/site";
import { IconLeaf, IconHand, IconTruck } from "@/components/icons";

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
              className="rounded-2xl h-80 relative overflow-hidden flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#6B4A2F,#241610)" }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-[0.12]" preserveAspectRatio="none" viewBox="0 0 400 320">
                {[40, 90, 145, 205, 270].map((y) => (
                  <path key={y} d={`M-20 ${y} C 80 ${y - 20}, 180 ${y + 20}, 300 ${y - 10} S 420 ${y + 6}, 440 ${y}`}
                    fill="none" stroke="#E8C97A" strokeWidth="1.6" />
                ))}
              </svg>
              <span className="relative font-display italic text-[#EFE3CC]/85 text-2xl px-8 text-center">
                Crafted in Sardarshahar, Rajasthan
              </span>
            </div>
          )}
          <p className="text-[#5C4B3D] leading-8 whitespace-pre-line">{aboutText}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mt-14">
          {[
            { Icon: IconLeaf, t: "Honest Material", d: "Seasoned sheesham & teak — no veneer, no shortcuts." },
            { Icon: IconHand, t: "Artisan Made", d: "Carved and polished by hand, piece by piece." },
            { Icon: IconTruck, t: "Across India", d: "Carefully packed and delivered to your doorstep." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="bg-white border border-line rounded-2xl p-6 text-center shadow-[0_2px_10px_rgba(74,51,37,.05)] hover:shadow-[0_8px_24px_rgba(74,51,37,.10)] hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FBF7EE] border border-line flex items-center justify-center">
                <Icon className="w-5 h-5 text-golddeep" />
              </div>
              <h3 className="font-bold text-walnut mt-3 mb-1">{t}</h3>
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
