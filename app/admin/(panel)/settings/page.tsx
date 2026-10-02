import SettingsForm from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/admin";

export default async function SettingsPage() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("settings").select("key,value");

  const initial: Record<string, string> = {};
  (data || []).forEach((r: { key: string; value: string | null }) => {
    initial[r.key] = r.value || "";
  });

  return (
    <div className="rise">
      <h1 className="font-display text-3xl font-bold text-walnut mb-1">Site Settings</h1>
      <p className="text-sm text-muted mb-6">Everything your website displays — name, contact, hero, social links.</p>
      <SettingsForm initial={initial} />
    </div>
  );
}
