import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Devwood Dekor",
  robots: "noindex, nofollow",
};

/**
 * NOTE: the admin area deliberately has its own minimal layout —
 * no public navbar, no public footer, no links from the public site.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F7F2E8]">{children}</div>;
}
