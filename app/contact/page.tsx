import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import SectionHead from "@/components/public/SectionHead";
import ContactForm from "./ContactForm";
import { getSettings } from "@/lib/site";
import { IconPhone, IconWhatsApp, IconPin } from "@/components/icons";

export const metadata = { title: "Contact — Devwood Dekor" };

export default async function ContactPage() {
  const settings = await getSettings();
  const siteName = settings.site_name || "Devwood Dekor";
  const whatsapp = settings.whatsapp || "";

  return (
    <>
      <Navbar siteName={siteName} whatsapp={whatsapp} />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
        <SectionHead title="Get in Touch" subtitle="Questions about a piece? Send us a message." />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-line rounded-2xl p-7">
            <h3 className="font-display text-xl font-bold text-walnut mb-5">Store Details</h3>
            <div className="space-y-4 text-[15px]">
              {settings.phone && (
                <p className="flex items-center gap-3"><IconPhone className="w-4.5 h-4.5 w-[18px] h-[18px] text-golddeep flex-none" /> <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="font-semibold text-bark hover:text-golddeep">{settings.phone}</a></p>
              )}
              {whatsapp && (
                <p className="flex items-center gap-3"><IconWhatsApp className="w-[18px] h-[18px] text-[#1FA855] flex-none" /> <span className="font-semibold text-bark">WhatsApp: +{whatsapp.replace(/\D/g, "")}</span></p>
              )}
              {settings.address && <p className="flex items-start gap-3"><IconPin className="w-[18px] h-[18px] text-golddeep flex-none mt-0.5" /> <span className="text-bark">{settings.address}</span></p>}
              <div className="flex gap-4 pt-2 text-sm font-semibold">
                {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" className="text-golddeep hover:underline">Facebook</a>}
                {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" className="text-golddeep hover:underline">Instagram</a>}
                {settings.youtube && <a href={settings.youtube} target="_blank" rel="noreferrer" className="text-golddeep hover:underline">YouTube</a>}
              </div>
            </div>
          </div>
          <ContactForm whatsapp={whatsapp} siteName={siteName} />
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
