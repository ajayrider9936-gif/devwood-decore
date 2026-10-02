import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin";

/**
 * Shared shell for all protected admin pages.
 * The sidebar stays mounted during client-side navigation, so only the
 * content area swaps — this makes moving between sections feel instant.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return <AdminShell email={user.email || ""}>{children}</AdminShell>;
}
