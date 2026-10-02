"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { IconLock } from "@/components/icons";

const CONFIGURED =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#CBBFA8]">Loading…</div>}>
      <AdminLogin />
    </Suspense>
  );
}

function AdminLogin() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const urlError = sp.get("error");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const sb = getSupabaseBrowser();
      const { data, error: signErr } = await sb.auth.signInWithPassword({ email, password });
      if (signErr) throw signErr;

      // owner allowlist check
      const { data: allow } = await sb
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!allow) {
        await sb.auth.signOut();
        throw new Error("This account is not an admin. Ask the owner to allowlist it.");
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "radial-gradient(circle at 50% 20%,#3A281D,#1B110B)" }}
    >
      <form
        onSubmit={login}
        className="bg-ivory rounded-3xl w-full max-w-[400px] shadow-2xl overflow-hidden rise"
      >
        <div className="h-1.5 bg-gradient-to-r from-gold via-[#E0A93E] to-golddeep" />
        <div className="p-8 sm:p-10">
        <div className="font-display text-3xl font-extrabold text-walnut text-center">
          Devwood <span className="italic text-golddeep">Dekor</span>
        </div>
        <p className="text-center text-muted text-sm mt-2 mb-7">
          Admin Panel — sign in to manage your store
        </p>

        {!CONFIGURED || urlError === "config" ? (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            Supabase is not connected yet. Add <b>NEXT_PUBLIC_SUPABASE_URL</b> and{" "}
            <b>NEXT_PUBLIC_SUPABASE_ANON_KEY</b> in Vercel → Environment Variables, then redeploy.
          </div>
        ) : null}

        {urlError === "not-admin" && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            This account is not an admin.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <label className="block text-[13px] font-bold text-bark mb-1.5">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border-[1.5px] border-line rounded-xl px-4 py-3 text-sm bg-white mb-4 transition-shadow focus:shadow-[0_0_0_3px_rgba(194,148,58,.15)]"
        />
        <label className="block text-[13px] font-bold text-bark mb-1.5">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full border-[1.5px] border-line rounded-xl px-4 py-3 text-sm bg-white mb-5 transition-shadow focus:shadow-[0_0_0_3px_rgba(194,148,58,.15)]"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-gradient-to-br from-gold to-golddeep text-white font-extrabold py-3.5 rounded-xl disabled:opacity-60 hover:opacity-95 shadow-[0_4px_16px_rgba(154,115,38,.4)] transition-all inline-flex items-center justify-center gap-2"
        >
          {busy && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
          {busy ? "Signing in…" : "Login →"}
        </button>
        <p className="text-center text-xs text-muted mt-4 inline-flex items-center gap-1.5 justify-center w-full"><IconLock className="w-3.5 h-3.5" /> Secure admin access • Supabase Auth</p>
        </div>
      </form>
    </div>
  );
}
