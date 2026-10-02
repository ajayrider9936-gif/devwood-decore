import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./supabase-config";

/** Server-side Supabase (Server Components / Route Handlers). Server only. */
export async function getSupabaseServer() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (
        cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
      ) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          /* called from a Server Component — cookies are read-only there */
        }
      },
    },
  });
}
