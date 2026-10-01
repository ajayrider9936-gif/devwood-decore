// ==========================================================================
// Vercel Serverless Function — /api/config
// --------------------------------------------------------------------------
// Kaam: Vercel ke Environment Variables (SUPABASE_URL, SUPABASE_ANON_KEY)
// ko browser tak pahunchana. Static HTML env var directly nahi padh sakta,
// isliye ye chhota sa bridge hai.
//
// Vercel me ye 2 env variables add karna (SUPABASE-SETUP.md Step 5 dekho):
//   SUPABASE_URL      = https://xyzabc.supabase.co
//   SUPABASE_ANON_KEY = (anon public key)
//
// Note: anon key public-safe hai — asli security database ke RLS rules me hai.
// ==========================================================================

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
  });
}
