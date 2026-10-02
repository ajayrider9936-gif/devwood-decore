import { redirect } from "next/navigation";
import { getSupabaseServer } from "./supabase-server";
import { isSupabaseConfigured } from "./supabase-config";

/**
 * Call at the top of every protected admin page.
 * - Not configured  -> back to login with a setup notice
 * - No session      -> back to login
 * - Not in admin_users allowlist -> sign out + back to login with an error
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin?error=config");
  const sb = await getSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin");

  const { data: allow } = await sb
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!allow) {
    await sb.auth.signOut();
    redirect("/admin?error=not-admin");
  }
  return { sb, user };
}
