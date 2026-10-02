import Link from "next/link";
import { IconPhone, IconWhatsApp, IconPin } from "@/components/icons";

export default function Footer({
  siteName,
  phone,
  whatsapp,
  address,
  footerText,
}: {
  siteName: string;
  phone: string;
  whatsapp: string;
  address: string;
  footerText: string;
}) {
  const [brand, ...rest] = siteName.split(" ");
  return (
    <footer className="bg-walnut text-[#CBBFA8] mt-0">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid gap-10 md:grid-cols-3 text-sm leading-7">
        <div>
          <div className="font-display text-2xl font-extrabold text-[#F5EDDD] mb-3">
            {brand} <span className="italic text-gold">{rest.join(" ")}</span>
          </div>
          <p>Handcrafted wooden furniture &amp; décor, made with love in India.</p>
          {footerText && <p className="mt-3 text-xs opacity-80">{footerText}</p>}
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Explore</h4>
          <div className="flex flex-col gap-1">
            <Link href="/" className="hover:text-gold">Home</Link>
            <Link href="/shop" className="hover:text-gold">Shop</Link>
            <Link href="/about" className="hover:text-gold">About Us</Link>
            <Link href="/contact" className="hover:text-gold">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Contact</h4>
          {phone && <p className="flex items-center gap-2.5"><IconPhone className="w-4 h-4 text-gold flex-none" /> {phone}</p>}
          {whatsapp && <p className="flex items-center gap-2.5"><IconWhatsApp className="w-4 h-4 text-[#1FA855] flex-none" /> WhatsApp: +{whatsapp.replace(/\D/g, "")}</p>}
          {address && <p className="flex items-start gap-2.5 mt-2"><IconPin className="w-4 h-4 text-gold flex-none mt-1" /> {address}</p>}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs opacity-70">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
