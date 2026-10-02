import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./lib/supabase-config";

/**
 * Protects /admin/* (except the /admin login page itself).
 * No session -> redirect to /admin login.
 * The admin_users allowlist is enforced inside the dashboard (server-side).
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Supabase not configured yet -> let pages render their friendly setup notice
  if (!isSupabaseConfigured()) return res;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) =>
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        ),
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = req.nextUrl.pathname === "/admin";
  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
