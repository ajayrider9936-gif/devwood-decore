# Devwood Dekor — Next.js

Handcrafted wooden furniture store with a full admin panel. Built with Next.js 15 (App Router), Tailwind CSS v4, and Supabase (PostgreSQL + Auth + Storage).

## Structure

- `app/` — public pages (`/`, `/shop`, `/product/[slug]`, `/about`, `/contact`) and the separate admin area (`/admin/*`)
- `components/public/` — Navbar, Footer, ProductCard, CategoryCard, …
- `components/admin/` — AdminShell, ProductForm, CategoryManager, SettingsForm, …
- `lib/` — Supabase clients, data fetchers, WhatsApp helpers
- `supabase/schema.sql` — full database schema (idempotent, safe to re-run)
- `middleware.ts` — protects `/admin/*` (login required)

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev
```

## Deploy (Vercel)

Push to `main` — Vercel auto-deploys. Set these Environment Variables (Production + Preview), then **Redeploy**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the `sb_publishable_…` key — never the service_role key)

Full Hindi setup guide: `SUPABASE-SETUP.md`.
