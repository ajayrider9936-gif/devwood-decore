// ==========================================================================
// DEVWOOD DEKOR — Shared Data Layer (Supabase)
// --------------------------------------------------------------------------
// Website (index/shop/about/contact) aur Admin Panel dono isi file ka
// istemal karte hain. Supabase se settings, categories, products padhna,
// photo upload karna — sab kuch yahan hai.
//
// Pages me load order (</body> se pehle):
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="js/config.js"></script>
//   <script src="js/db.js"></script>
// ==========================================================================

(function () {
  "use strict";

  const BUCKET = "product-images";

  let _client = null;
  let _configError = "";

  // ---- Config: pehle /api/config (Vercel env), nahi mila to js/config.js ----
  async function loadConfig() {
    // 1) Vercel serverless bridge
    try {
      const r = await fetch("/api/config", { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        if (j.url && j.anonKey) return { url: j.url, anonKey: j.anonKey };
      }
    } catch (e) { /* bridge nahi hai — fallback try karo */ }

    // 2) Fallback: js/config.js me haath se bhari keys
    const fb = window.DEVWOOD_CONFIG || {};
    if (fb.url && fb.anonKey) return { url: fb.url, anonKey: fb.anonKey };

    _configError = "Supabase keys nahi mili. Vercel me SUPABASE_URL aur SUPABASE_ANON_KEY env variables add karke Redeploy karo (SUPABASE-SETUP.md Step 5).";
    return null;
  }

  async function client() {
    if (_client) return _client;
    const cfg = await loadConfig();
    if (!cfg) throw new Error(_configError);
    if (!window.supabase) throw new Error("Supabase JS library load nahi hui.");
    _client = window.supabase.createClient(cfg.url, cfg.anonKey);
    return _client;
  }

  // ---- SETTINGS: key-value → { site_name: "...", phone: "..." } ----
  async function getSettings() {
    const sb = await client();
    const { data, error } = await sb.from("settings").select("key,value");
    if (error) throw error;
    const out = {};
    (data || []).forEach((r) => { out[r.key] = r.value; });
    return out;
  }

  async function saveSettings(obj) {
    const sb = await client();
    const rows = Object.entries(obj).map(([key, value]) => ({
      key, value: value == null ? "" : String(value), updated_at: new Date().toISOString(),
    }));
    const { error } = await sb.from("settings").upsert(rows, { onConflict: "key" });
    if (error) throw error;
  }

  // ---- CATEGORIES ----
  async function getCategories(activeOnly = true) {
    const sb = await client();
    let q = sb.from("categories").select("*").order("sort_order", { ascending: true }).order("name");
    if (activeOnly) q = q.eq("is_active", true);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }

  async function saveCategory(cat) {
    const sb = await client();
    const payload = {
      name: cat.name, slug: cat.slug, image_url: cat.image_url || null,
      sort_order: Number(cat.sort_order) || 0, is_active: !!cat.is_active,
    };
    let res;
    if (cat.id) res = await sb.from("categories").update(payload).eq("id", cat.id).select().single();
    else res = await sb.from("categories").insert(payload).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  async function deleteCategory(id) {
    const sb = await client();
    // Pehle is category ke products ko uncategorized karo (delete set null waise bhi karega)
    const { error } = await sb.from("categories").delete().eq("id", id);
    if (error) throw error;
  }

  // ---- PRODUCTS ----
  function mapProduct(p) {
    const cat = p.categories || null;
    return {
      id: p.id,
      name: p.name || "",
      category: cat ? cat.slug : "",          // purane code ke liye slug
      categoryName: cat ? cat.name : "—",     // dikhane ke liye naam
      category_id: p.category_id,
      price: Number(p.price) || 0,
      originalPrice: p.mrp != null ? Number(p.mrp) : null,  // purana field naam
      mrp: p.mrp,
      badge: p.badge || "",
      woodType: p.wood_type || "",
      dimensions: p.dimensions || "",
      finish: p.finish || "",
      description: p.description || "",
      image: (p.images && p.images[0]) || "",  // purane code ke liye pehli photo
      images: p.images || [],
      rating: 5.0,
      reviewsCount: 0,
      isAntique: false,
      is_featured: !!p.is_featured,
      is_active: !!p.is_active,
      sort_order: p.sort_order || 0,
      created_at: p.created_at,
    };
  }

  async function getProducts(activeOnly = true) {
    const sb = await client();
    let q = sb.from("products")
      .select("*, categories(id,name,slug)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (activeOnly) q = q.eq("is_active", true);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map(mapProduct);
  }

  async function getProduct(id) {
    const sb = await client();
    const { data, error } = await sb.from("products")
      .select("*, categories(id,name,slug)").eq("id", id).single();
    if (error) throw error;
    return mapProduct(data);
  }

  async function saveProduct(p) {
    const sb = await client();
    const payload = {
      name: p.name,
      category_id: p.category_id || null,
      price: Number(p.price) || 0,
      mrp: p.mrp === "" || p.mrp == null ? null : Number(p.mrp),
      badge: p.badge || null,
      wood_type: p.wood_type || null,
      dimensions: p.dimensions || null,
      finish: p.finish || null,
      description: p.description || null,
      images: p.images || [],
      is_featured: !!p.is_featured,
      is_active: p.is_active !== false,
      sort_order: Number(p.sort_order) || 0,
    };
    let res;
    if (p.id) res = await sb.from("products").update(payload).eq("id", p.id).select().single();
    else res = await sb.from("products").insert(payload).select().single();
    if (res.error) throw res.error;
    return mapProduct({ ...res.data, categories: p._cat || null });
  }

  async function deleteProduct(id) {
    const sb = await client();
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) throw error;
  }

  // ---- IMAGE UPLOAD (client-side compress + Supabase Storage) ----
  function compressImage(file, maxDim = 1280, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width: w, height: h } = img;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        w = Math.round(w * scale); h = Math.round(h * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Photo compress nahi ho payi"));
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }));
        }, "image/jpeg", quality);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Photo padhi nahi ja saki")); };
      img.src = url;
    });
  }

  async function uploadImage(file, folder = "products") {
    const sb = await client();
    const compressed = await compressImage(file);
    const ext = "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, compressed, {
      contentType: "image/jpeg", upsert: false,
    });
    if (error) throw error;
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  // ---- AUTH (admin login) ----
  async function signIn(email, password) {
    const sb = await client();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  async function signOut() {
    const sb = await client();
    await sb.auth.signOut();
  }

  async function currentUser() {
    const sb = await client();
    const { data } = await sb.auth.getUser();
    return data.user || null;
  }

  // ---- Helpers ----
  function slugify(text) {
    return String(text || "").toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
  }

  function configError() { return _configError; }

  window.DevwoodDB = {
    client, getSettings, saveSettings,
    getCategories, saveCategory, deleteCategory,
    getProducts, getProduct, saveProduct, deleteProduct,
    uploadImage, signIn, signOut, currentUser,
    slugify, configError,
  };
})();
