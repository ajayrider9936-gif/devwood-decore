import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/admin";

export default async function SettingsPage() {
  const { sb, user } = await requireAdmin();
  const { data } = await sb.from("settings").select("key,value");
  const initial: Record<string, string> = {};
  (data || []).forEach((r: { key: string; value: string }) => (initial[r.key] = r.value ?? ""));

  return (
    <AdminShell email={user.email || ""}>
      <h1 className="font-display text-3xl font-bold text-walnut mb-2">Site Settings</h1>
      <p className="text-sm text-muted mb-6">
        Phone, WhatsApp, address, hero text — everything the website shows lives here.
      </p>
      <SettingsForm initial={initial} />
    </AdminShell>
  );
}
