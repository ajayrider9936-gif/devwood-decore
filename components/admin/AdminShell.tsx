"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { IconGrid, IconBox, IconFolder, IconGear, IconLogout, IconGlobe } from "@/components/icons";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: IconGrid },
  { href: "/admin/products", label: "Products", Icon: IconBox },
  { href: "/admin/categories", label: "Categories", Icon: IconFolder },
  { href: "/admin/settings", label: "Site Settings", Icon: IconGear },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    try {
      const sb = getSupabaseBrowser();
      await sb.auth.signOut();
    } catch {
      /* ignore */
    }
    router.push("/admin");
    router.refresh();
  };

  const nav = (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-5">
        <div className="font-display text-xl font-extrabold text-[#F5EDDD]">
          Devwood <span className="italic text-gold">Dekor</span>
        </div>
        <p className="text-[11px] text-[#8A7663] mt-1 truncate">{email}</p>
      </div>
      <nav className="flex-1">
        {LINKS.map((l) => {
          const active =
            pathname === l.href || (l.href !== "/admin/dashboard" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-semibold border-l-[3px] transition-colors ${
                active
                  ? "bg-[rgba(194,148,58,.16)] text-[#F0D9A0] border-gold shadow-[inset_0_0_20px_rgba(194,148,58,.08)]"
                  : "text-[#CBBFA8] border-transparent hover:text-white"
              }`}
            >
              <l.Icon className="w-[18px] h-[18px] flex-none" /> {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-semibold text-[#CBBFA8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <IconGlobe className="w-4 h-4" /> View Website <span className="text-xs opacity-60">↗</span>
        </a>
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#CBBFA8] hover:text-white rounded-lg hover:bg-white/5"
        >
          <span className="inline-flex items-center gap-2"><IconLogout className="w-4 h-4" /> Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F2E8] flex">
      <aside className="hidden md:block w-60 flex-none bg-walnut sticky top-0 h-screen">{nav}</aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-walnut">{nav}</aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="md:hidden sticky top-0 z-30 bg-walnut text-white px-4 py-3 flex items-center justify-between">
          <span className="font-display font-bold">Devwood <span className="italic text-gold">Dekor</span></span>
          <button onClick={() => setOpen(true)} className="text-2xl" aria-label="Menu">☰</button>
        </div>
        <main className="p-4 sm:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
