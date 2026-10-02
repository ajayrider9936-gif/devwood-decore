"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { waLink } from "@/lib/whatsapp";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({
  siteName,
  whatsapp,
}: {
  siteName: string;
  whatsapp: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [brand, ...rest] = siteName.split(" ");

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur border-b border-line">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4">
        <Link href="/" className="font-display text-2xl font-extrabold text-walnut">
          {brand} <span className="italic text-golddeep">{rest.join(" ")}</span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-bark">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "text-golddeep" : "hover:text-golddeep"}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {whatsapp && (
            <a
              href={waLink(whatsapp, "Hello Devwood Dekor! I want to enquire about your furniture.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block bg-leaf text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90"
            >
              WhatsApp Us
            </a>
          )}
          <button
            className="md:hidden text-2xl text-walnut px-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-line bg-ivory px-6 py-4 flex flex-col gap-3 text-[15px] font-semibold text-bark">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={pathname === l.href ? "text-golddeep" : ""}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
