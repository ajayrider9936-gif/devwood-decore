"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { slugify } from "@/lib/types";
import type { Category } from "@/lib/types";
import { compressImage } from "./compressImage";

export default function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startAdd = () => {
    setEditing(null);
    setName(""); setSlug(""); setImageUrl(""); setSortOrder("0");
    setError("");
  };
  const startEdit = (c: Category) => {
    setEditing(c);
    setName(c.name); setSlug(c.slug); setImageUrl(c.image_url || ""); setSortOrder(String(c.sort_order));
    setError("");
  };

  const uploadImage = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setUploading(true);
    try {
      const sb = getSupabaseBrowser();
      const blob = await compressImage(files[0], 800, 0.8);
      const path = `categories/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const { error: upErr } = await sb.storage.from("product-images").upload(path, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = sb.storage.from("product-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setError("");
    if (!name.trim()) return setError("Category name is required.");
    setSaving(true);
    try {
      const sb = getSupabaseBrowser();
      const row = {
        ...(editing ? { id: editing.id } : {}),
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        image_url: imageUrl || null,
        sort_order: Number(sortOrder) || 0,
      };
      const { error: upErr } = editing
        ? await sb.from("categories").update(row).eq("id", editing.id)
        : await sb.from("categories").insert(row);
      if (upErr) throw upErr;
      startAdd();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c: Category) => {
    const sb = getSupabaseBrowser();
    await sb.from("categories").update({ is_active: !c.is_active }).eq("id", c.id);
    router.refresh();
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"? Products in it will become uncategorized.`)) return;
    const sb = getSupabaseBrowser();
    const { error } = await sb.from("categories").delete().eq("id", c.id);
    if (error) alert(error.message);
    else router.refresh();
  };

  const inputCls = "w-full border-[1.5px] border-line rounded-xl px-4 py-2.5 text-sm bg-white";

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* LIST */}
      <div className="lg:col-span-3 bg-white border border-line rounded-2xl overflow-hidden h-fit">
        {initial.length === 0 && (
          <p className="px-6 py-10 text-center text-muted text-sm">No categories yet.</p>
        )}
        {initial.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F0E8D6] last:border-0">
            {c.image_url ? (
              <img src={c.image_url} alt="" className="w-11 h-11 rounded-full object-cover flex-none" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFF8E8,#F0E2C4)] border-2 border-gold flex-none flex items-center justify-center font-display font-extrabold text-golddeep">
                {c.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink truncate">{c.name}</p>
              <p className="text-xs text-muted">/{c.slug} • order {c.sort_order}</p>
            </div>
            <button
              onClick={() => toggle(c)}
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full flex-none ${
                c.is_active ? "bg-[#E3F5E9] text-[#177A3E]" : "bg-[#F3E8DC] text-golddeep"
              }`}
            >
              {c.is_active ? "● Live" : "○ Hidden"}
            </button>
            <button onClick={() => startEdit(c)} className="text-golddeep font-bold text-[13px] hover:underline flex-none">Edit</button>
            <button onClick={() => remove(c)} className="text-red-700 font-bold text-[13px] hover:underline flex-none">Delete</button>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div className="lg:col-span-2 bg-white border border-line rounded-2xl p-6 h-fit">
        <h3 className="font-bold text-walnut mb-4">{editing ? "Edit Category" : "Add Category"}</h3>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5 mb-4">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-bark mb-1.5">Name *</label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => { setName(e.target.value); if (!editing) setSlug(slugify(e.target.value)); }}
              placeholder="e.g. Wall Clock"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-bark mb-1.5">Slug</label>
            <input className={inputCls} value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="wall-clock" />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-bark mb-1.5">Photo (optional)</label>
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-line" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-cream border border-line flex items-center justify-center text-muted text-xl">🖼️</div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="text-sm font-bold text-golddeep border-[1.5px] border-gold px-4 py-2 rounded-full hover:bg-[#FBF7EE] disabled:opacity-50"
              >
                {uploading ? "Uploading…" : imageUrl ? "Change" : "Upload"}
              </button>
              {imageUrl && (
                <button onClick={() => setImageUrl("")} className="text-sm text-red-700 font-bold hover:underline">Remove</button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files)} />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-bark mb-1.5">Display Order</label>
            <input className={inputCls} inputMode="numeric" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={save}
              disabled={saving || uploading}
              className="bg-gradient-to-br from-gold to-golddeep text-white text-sm font-bold px-6 py-2.5 rounded-full disabled:opacity-60"
            >
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Category"}
            </button>
            {editing && (
              <button onClick={startAdd} className="text-sm font-bold text-bark hover:underline">Cancel</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
