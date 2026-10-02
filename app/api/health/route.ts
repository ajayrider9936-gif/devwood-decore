import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase-config";

/** Lightweight health check — also tells whether Supabase env is wired up. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "devwood-dekor",
    supabaseConfigured: isSupabaseConfigured(),
    time: new Date().toISOString(),
  });
}
