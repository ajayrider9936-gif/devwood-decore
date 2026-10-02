"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const LABELS: Record<string, string> = {
  site_name: "Site Name",
  tagline: "Tagline",
  phone: "Phone (display)",
  whatsapp: "WhatsApp Number (digits only, with country code)",
  address: "Address",
  map_url: "Google Maps Link",
  announcement: "Announcement Bar Text",
  hero_badge: "Hero Badge",
  hero_title: "Hero Title",
  hero_subtitle: "Hero Subtitle",
  hero_image: "Hero Image URL",
  about_title: "About Title",
  about_text: "About Text",
  about_image: "About Image URL",
  facebook: "Facebook URL",
  instagram: "Instagram URL",
  youtube: "YouTube URL",
  logo_url: "Logo Image URL",
  footer_text: "Footer Text",
};

const LONG_KEYS = new Set(["hero_subtitle", "about_text", "footer_text", "address", "announcement"]);

export default function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [newKey, setNewKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const sb = getSupabaseBrowser();
      const rows = Object.entries(values).map(([key, value]) => ({
        key,
        value: value ?? "",
        updated_at: new Date().toISOString(),
      }));
      const { error: upErr } = await sb.from("settings").upsert(rows, { onConflict: "key" });
      if (upErr) throw upErr;
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addKey = () => {
    const k = newKey.trim();
    if (!k || values[k] !== undefined) return;
    setValues((v) => ({ ...v, [k]: "" }));
    setNewKey("");
  };

  const inputCls = "w-full border-[1.5px] border-line rounded-xl px-4 py-2.5 text-sm bg-white";

  return (
    <div className="max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
      )}
      {saved && (
        <div className="bg-[#E3F5E9] border border-green-200 text-[#177A3E] text-sm rounded-xl px-4 py-3 mb-5">
          ✓ Settings saved.
        </div>
      )}

      <div className="bg-white border border-line rounded-2xl p-6 space-y-5">
        {Object.keys(values)
          .sort()
          .map((key) => (
            <div key={key}>
              <label className="block text-[13px] font-bold text-bark mb-1.5">
                {LABELS[key] || key} <span className="font-mono font-normal text-muted">({key})</span>
              </label>
              {LONG_KEYS.has(key) ? (
                <textarea className={inputCls} rows={3} value={values[key]} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
              ) : (
                <input className={inputCls} value={values[key]} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
              )}
            </div>
          ))}

        <div className="flex gap-3 pt-2 border-t border-line">
          <input
            className={inputCls + " max-w-xs"}
            placeholder="new_setting_key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <button onClick={addKey} className="text-sm font-bold text-golddeep border-[1.5px] border-gold px-5 rounded-full hover:bg-[#FBF7EE]">
            + Add Key
          </button>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 bg-gradient-to-br from-gold to-golddeep text-white font-bold px-10 py-3 rounded-full disabled:opacity-60 hover:opacity-95"
      >
        {saving ? "Saving…" : "Save All Settings"}
      </button>
    </div>
  );
}
