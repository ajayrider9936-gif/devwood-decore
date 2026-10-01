// ==========================================================================
// DEVWOOD DEKOR — Fallback Config
// --------------------------------------------------------------------------
// Ye file SIRF tab kaam aayegi jab /api/config (Vercel) uplabdh na ho,
// jaise GitHub Pages par hosting ho.
//
// Vercel par deploy kar rahe ho to IS FILE ME KUCH BADALNE KI ZAROORAT NAHI —
// env variables (SUPABASE_URL, SUPABASE_ANON_KEY) api/config.js se aayengi.
//
// GitHub Pages / Netlify (bina serverless) par ho to neeche apni keys bhar do:
// ==========================================================================
window.DEVWOOD_CONFIG = {
  url: "",      // yahan Supabase Project URL paste karo
  anonKey: "",  // yahan Supabase "anon public" key paste karo
};
