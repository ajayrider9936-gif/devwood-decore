"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { slugify } from "@/lib/types";
import type { Category, Product } from "@/lib/types";
import { compressImage } from "./compressImage";

type Props = { product: Product | null; categories: Category[] };

export default function ProductForm({ product, categories }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const productId = useRef(product?.id || crypto.randomUUID());

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!product?.slug);
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [mrp, setMrp] = useState(product?.mrp?.toString() || "");
  const [badge, setBadge] = useState(product?.badge || "");
  const [woodType, setWoodType] = useState(product?.wood_type || "");
  const [dimensions, setDimensions] = useState(product?.dimensions || "");
  const [finish, setFinish] = useState(product?.finish || "");
  const [description, setDescription] = useState(product?.description || "");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onName = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const sb = getSupabaseBrowser();
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const blob = await compressImage(file);
        const path = `${productId.current}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const { error: upErr } = await sb.storage.from("product-images").upload(path, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data } = sb.storage.from("product-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setImages((prev) => [...prev, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
    // best-effort storage cleanup
    try {
      const sb = getSupabaseBrowser();
      const marker = "/product-images/";
      const idx = url.indexOf(marker);
      if (idx > -1) {
        const path = url.slice(idx + marker.length);
        await sb.storage.from("product-images").remove([path]);
      }
    } catch {
      /* ignore */
    }
  };

  const makeCover = (url: string) =>
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);

  const save = async () => {
    setError("");
    if (!name.trim()) return setError("Product name is required.");
    const priceNum = Number(price);
    if (!price || isNaN(priceNum) || priceNum < 0) return setError("Enter a valid price.");
    setSaving(true);
    try {
      const sb = getSupabaseBrowser();
      const row = {
        id: productId.current,
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        category_id: categoryId || null,
        price: Math.round(priceNum),
        mrp: mrp ? Math.round(Number(mrp)) : null,
        badge: badge.trim() || null,
        wood_type: woodType.trim() || null,
        dimensions: dimensions.trim() || null,
        finish: finish.trim() || null,
        description: description.trim() || null,
        images,
        is_active: isActive,
        is_featured: isFeatured,
      };
      const { error: upErr } = await sb.from("products").upsert(row, { onConflict: "id" });
      if (upErr) throw upErr;
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full border-[1.5px] border-line rounded-xl px-4 py-2.5 text-sm bg-white transition-shadow focus:shadow-[0_0_0_3px_rgba(194,148,58,.15)]";
  const labelCls = "block text-[13px] font-bold text-bark mb-1.5";

  return (
    <div className="max-w-3xl rise">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
          {error}
        </div>
      )}

      {/* PHOTOS */}
      <div className="bg-white border border-line rounded-2xl p-6 mb-5 shadow-[0_2px_10px_rgba(74,51,37,.05)]">
        <h3 className="font-display text-lg font-bold text-walnut mb-1">Photos</h3>
        <p className="text-xs text-muted mb-4">First photo is the cover. Upload as many as you like.</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {images.map((url, i) => (
            <div key={url} className="relative w-24 h-24 group">
              <img src={url} alt="" className="w-24 h-24 rounded-xl object-cover border border-line" />
              {i === 0 && (
                <span className="absolute -top-2 -left-2 bg-gold text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  COVER
                </span>
              )}
              <div className="absolute inset-0 rounded-xl bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                {i !== 0 && (
                  <button onClick={() => makeCover(url)} className="text-white text-[11px] font-bold hover:underline">
                    Set cover
                  </button>
                )}
                <button onClick={() => removeImage(url)} className="text-red-300 text-[11px] font-bold hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gold text-golddeep text-3xl font-light hover:bg-[#FBF7EE] disabled:opacity-50"
            title="Upload photos"
          >
            {uploading ? "…" : "+"}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
        {uploading && <p className="text-xs text-muted">Compressing & uploading…</p>}
      </div>

      {/* DETAILS */}
      <div className="bg-white border border-line rounded-2xl p-6 mb-5 grid sm:grid-cols-2 gap-4 shadow-[0_2px_10px_rgba(74,51,37,.05)]">
        <h3 className="font-display text-lg font-bold text-walnut sm:col-span-2 -mb-1">Details</h3>
        <div className="sm:col-span-2">
          <label className={labelCls}>Product Name *</label>
          <input className={inputCls} value={name} onChange={(e) => onName(e.target.value)} placeholder="e.g. Royal Teak Jhula" />
        </div>
        <div>
          <label className={labelCls}>URL Slug</label>
          <input
            className={inputCls}
            value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            placeholder="royal-teak-jhula"
          />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select className={inputCls} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">— No category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Price (₹) *</label>
          <input className={inputCls} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="24999" />
        </div>
        <div>
          <label className={labelCls}>MRP (₹) — optional</label>
          <input className={inputCls} inputMode="numeric" value={mrp} onChange={(e) => setMrp(e.target.value)} placeholder="32999" />
        </div>
        <div>
          <label className={labelCls}>Badge — optional</label>
          <input className={inputCls} value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Best Seller / New Arrival" />
        </div>
        <div>
          <label className={labelCls}>Wood Type</label>
          <input className={inputCls} value={woodType} onChange={(e) => setWoodType(e.target.value)} placeholder="Solid Sheesham Wood" />
        </div>
        <div>
          <label className={labelCls}>Dimensions</label>
          <input className={inputCls} value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder='72" L x 36" W x 40" H' />
        </div>
        <div>
          <label className={labelCls}>Finish</label>
          <input className={inputCls} value={finish} onChange={(e) => setFinish(e.target.value)} placeholder="Teak Brown Polish" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea className={inputCls} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell the story of this piece…" />
        </div>
      </div>

      {/* VISIBILITY */}
      <div className="bg-white border border-line rounded-2xl p-6 mb-6 shadow-[0_2px_10px_rgba(74,51,37,.05)]">
        <h3 className="font-display text-lg font-bold text-walnut mb-4">Visibility</h3>
        <div className="flex flex-wrap gap-4">
        <button type="button" onClick={() => setIsActive(!isActive)}
          className="flex items-center gap-3 text-sm font-semibold cursor-pointer group">
          <span className={`w-11 h-6 rounded-full p-1 transition-colors ${isActive ? "bg-[#1FA855]" : "bg-[#D8C9AC]"}`}>
            <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-5" : ""}`} />
          </span>
          <span className="text-left">Live on website<br /><span className="text-xs font-normal text-muted">{isActive ? "Visible to customers" : "Hidden from store"}</span></span>
        </button>
        <button type="button" onClick={() => setIsFeatured(!isFeatured)}
          className="flex items-center gap-3 text-sm font-semibold cursor-pointer group">
          <span className={`w-11 h-6 rounded-full p-1 transition-colors ${isFeatured ? "bg-gold" : "bg-[#D8C9AC]"}`}>
            <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform ${isFeatured ? "translate-x-5" : ""}`} />
          </span>
          <span className="text-left">Featured on homepage<br /><span className="text-xs font-normal text-muted">{isFeatured ? "Shown in highlights" : "Not highlighted"}</span></span>
        </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={saving || uploading}
          className="bg-gradient-to-br from-gold to-golddeep text-white font-bold px-8 py-3 rounded-full disabled:opacity-60 hover:opacity-95 shadow-[0_4px_14px_rgba(154,115,38,.3)] hover:-translate-y-px transition-all inline-flex items-center gap-2"
        >
          {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
          {saving ? "Saving…" : product ? "Save Changes" : "Add Product"}
        </button>
        <button
          onClick={() => router.push("/admin/products")}
          className="border-2 border-line text-bark font-bold px-8 py-3 rounded-full hover:border-walnut hover:bg-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
