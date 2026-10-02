"use client";

import { useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { slugify } from "@/lib/types";
import type { Category } from "@/lib/types";
import { compressImage } from "./compressImage";
import { IconImage } from "@/components/icons";

export default function CategoryManager({ initial }: { initial: Category[] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [cats, setCats] = useState<Category[]>(initial);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const startAdd = () => {
    setEditing(null);
    setName(""); setSlug(""); setImageUrl(""); setSortOrder("0");
    setError("");
  };
  const startEdit = (c: Category) => {
    setEditing(c);
    setName(c.name); setSlug(c.slug); setImageUrl(c.image_url || ""); setSortOrder(String(c.sort_order));
    setError(""); setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  const uploadImage = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setUploading(true);
    try {
      const sb = getSupabaseBrowser();
      const blob = await compressImage(files[0], 800, 0.8);
      const path = `categories/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
      const { error: upErr } = await sb.storage.from("product-images").upload(path, blob, {
        contentType: "image/webp",
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
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        image_url: imageUrl || null,
        sort_order: Number(sortOrder) || 0,
      };
      if (editing) {
        const { error: upErr } = await sb.from("categories").update(row).eq("id", editing.id);
        if (upErr) throw upErr;
        setCats((list) => list.map((c) => (c.id === editing.id ? { ...c, ...row } : c)));
        flash("✓ Category updated");
      } else {
        const { data, error: insErr } = await sb.from("categories").insert(row).select().single();
        if (insErr) throw insErr;
        setCats((list) => [...list, data as Category].sort((a, b) => a.sort_order - b.sort_order || (a.name < b.name ? -1 : 1)));
        flash("✓ Category added");
      }
      startAdd();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const toggle = (c: Category) => {
    const next = !c.is_active;
    // Optimistic: update UI instantly, sync in background
    setCats((list) => list.map((x) => (x.id === c.id ? { ...x, is_active: next } : x)));
    (async () => {
      try {
        const sb = getSupabaseBrowser();
        const { error } = await sb.from("categories").update({ is_active: next }).eq("id", c.id);
        if (error) throw error;
      } catch (e) {
        setCats((list) => list.map((x) => (x.id === c.id ? { ...x, is_active: c.is_active } : x)));
        alert(e instanceof Error ? e.message : "Failed to update");
      }
    })();
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"? Products in it will become uncategorized.`)) return;
    setDeleting(c.id);
    setCats((list) => list.filter((x) => x.id !== c.id));
    try {
      const sb = getSupabaseBrowser();
      const { error } = await sb.from("categories").delete().eq("id", c.id);
      if (error) throw error;
      if (editing?.id === c.id) startAdd();
    } catch (e) {
      setCats((list) => [...list, c].sort((a, b) => a.sort_order - b.sort_order || (a.name < b.name ? -1 : 1)));
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const inputCls =
    "w-full border-[1.5px] border-line rounded-xl px-4 py-2.5 text-sm bg-white transition-shadow focus:shadow-[0_0_0_3px_rgba(194,148,58,.15)]";

  return (
    <div className="grid lg:grid-cols-5 gap-6 items-start">
      {/* LIST */}
      <div className="lg:col-span-3 bg-white border border-line rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(74,51,37,.05)] h-fit">
        <div className="px-5 py-3.5 bg-[#FCFAF4] border-b border-line">
          <span className="text-xs font-extrabold uppercase tracking-wider text-bark">
            {cats.length} {cats.length === 1 ? "Category" : "Categories"}
          </span>
        </div>
        {cats.length === 0 && (
          <p className="px-6 py-10 text-center text-muted text-sm">No categories yet.</p>
        )}
        {cats.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F0E8D6] last:border-0 hover:bg-[#FCFAF4] transition-colors">
            {c.image_url ? (
              <img src={c.image_url} alt="" className="w-11 h-11 rounded-full object-cover flex-none border-2 border-gold/40" />
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
              title="Click to toggle live / hidden"
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full flex-none transition-all active:scale-95 cursor-pointer ${
                c.is_active ? "bg-[#E3F5E9] text-[#177A3E] hover:bg-[#D2EDDC]" : "bg-[#F3E8DC] text-golddeep hover:bg-[#EADDC8]"
              }`}
            >
              {c.is_active ? "● Live" : "○ Hidden"}
            </button>
            <button onClick={() => startEdit(c)} className="text-golddeep font-bold text-[13px] hover:underline flex-none">Edit</button>
            <button
              onClick={() => remove(c)}
              disabled={deleting === c.id}
              className="text-red-700 font-bold text-[13px] hover:underline flex-none disabled:opacity-40"
            >
              {deleting === c.id ? "…" : "Delete"}
            </button>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div className="lg:col-span-2 bg-white border border-line rounded-2xl p-6 h-fit shadow-[0_2px_10px_rgba(74,51,37,.05)] lg:sticky lg:top-6">
        <h3 className="font-display text-lg font-bold text-walnut mb-4">{editing ? "Edit Category" : "Add Category"}</h3>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5 mb-4">{error}</div>
        )}
        {notice && (
          <div className="bg-[#E3F5E9] border border-green-200 text-[#177A3E] text-sm rounded-xl px-4 py-2.5 mb-4">{notice}</div>
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
            <label className="block text-[13px] font-bold text-bark mb-1.5">Photo <span className="font-normal text-muted">(optional)</span></label>
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-line" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-cream border border-dashed border-gold/50 flex items-center justify-center"><IconImage className="w-6 h-6 text-muted" /></div>
              )}
              <div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="text-sm font-bold text-golddeep border-[1.5px] border-gold px-4 py-2 rounded-full hover:bg-[#FBF7EE] disabled:opacity-50 transition-colors"
                >
                  {uploading ? "Uploading…" : imageUrl ? "Change" : "Upload"}
                </button>
                {imageUrl && (
                  <button onClick={() => setImageUrl("")} className="block text-xs text-red-700 font-bold hover:underline mt-1.5 ml-1">Remove photo</button>
                )}
              </div>
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
              className="bg-gradient-to-br from-gold to-golddeep text-white text-sm font-bold px-6 py-2.5 rounded-full disabled:opacity-60 shadow-[0_4px_14px_rgba(154,115,38,.3)] hover:-translate-y-px transition-all"
            >
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Category"}
            </button>
            {editing && (
              <button onClick={startAdd} className="text-sm font-bold text-bark hover:underline self-center">Cancel</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
