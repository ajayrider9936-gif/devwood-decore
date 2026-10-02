"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { compressImage } from "./compressImage";
import { IconImage } from "@/components/icons";

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

// Settings keys that hold image URLs get an upload button alongside the URL field.
const isImageKey = (key: string) => key.includes("image") || key.includes("logo") || key.includes("photo");

export default function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [newKey, setNewKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<string | null>(null);

  const startUpload = (key: string) => {
    uploadTarget.current = key;
    fileRef.current?.click();
  };

  const onFilePicked = async (files: FileList | null) => {
    const key = uploadTarget.current;
    if (!key || !files || !files[0]) return;
    setUploadingKey(key);
    setError("");
    try {
      const sb = getSupabaseBrowser();
      const blob = await compressImage(files[0], 1600, 0.82);
      const path = `site/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
      const { error: upErr } = await sb.storage.from("product-images").upload(path, blob, {
        contentType: "image/webp",
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = sb.storage.from("product-images").getPublicUrl(path);
      setValues((v) => ({ ...v, [key]: data.publicUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setUploadingKey(null);
      uploadTarget.current = null;
      if (fileRef.current) fileRef.current.value = "";
    }
  };

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

  const inputCls = "w-full border-[1.5px] border-line rounded-xl px-4 py-2.5 text-sm bg-white transition-shadow focus:shadow-[0_0_0_3px_rgba(194,148,58,.15)]";

  return (
    <div className="max-w-3xl rise">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
      )}
      {saved && (
        <div className="bg-[#E3F5E9] border border-green-200 text-[#177A3E] text-sm rounded-xl px-4 py-3 mb-5">
          ✓ Settings saved.
        </div>
      )}

      <div className="bg-white border border-line rounded-2xl p-6 space-y-5 shadow-[0_2px_10px_rgba(74,51,37,.05)]">
        {Object.keys(values)
          .sort()
          .map((key) => (
            <div key={key}>
              <label className="block text-[13px] font-bold text-bark mb-1.5">
                {LABELS[key] || key} <span className="font-mono font-normal text-muted">({key})</span>
              </label>
              {LONG_KEYS.has(key) ? (
                <textarea className={inputCls} rows={3} value={values[key]} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
              ) : isImageKey(key) ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {values[key] ? (
                      <img src={values[key]} alt="" className="w-16 h-16 rounded-xl object-cover border border-line" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-cream border border-dashed border-gold/50 flex items-center justify-center">
                        <IconImage className="w-6 h-6 text-muted" />
                      </div>
                    )}
                    <button
                      onClick={() => startUpload(key)}
                      disabled={uploadingKey === key}
                      className="text-sm font-bold text-golddeep border-[1.5px] border-gold px-4 py-2 rounded-full hover:bg-[#FBF7EE] disabled:opacity-50 transition-colors inline-flex items-center gap-2"
                    >
                      {uploadingKey === key && <span className="w-3.5 h-3.5 border-2 border-golddeep/40 border-t-golddeep rounded-full animate-spin" />}
                      {uploadingKey === key ? "Uploading…" : values[key] ? "Replace image" : "Upload image"}
                    </button>
                    {values[key] && (
                      <button onClick={() => setValues((v) => ({ ...v, [key]: "" }))} className="text-xs text-red-700 font-bold hover:underline">
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    className={inputCls}
                    value={values[key]}
                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    placeholder="…or paste an image URL"
                  />
                </div>
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
        className="mt-6 bg-gradient-to-br from-gold to-golddeep text-white font-bold px-10 py-3 rounded-full disabled:opacity-60 hover:opacity-95 shadow-[0_4px_14px_rgba(154,115,38,.3)] hover:-translate-y-px transition-all inline-flex items-center gap-2"
      >
        {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
        {saving ? "Saving…" : saved ? "✓ Saved!" : "Save All Settings"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFilePicked(e.target.files)}
      />
    </div>
  );
}
