# Devwood Dekor — Supabase Setup (Next.js)

Ye guide Hindi me hai. Ek baar karne ke baad dobara zaroorat nahi.

## Step 1 — Database banao (5 minute)

1. [supabase.com](https://supabase.com) kholo → apna project kholo
2. Left menu → **SQL Editor** → **New query**
3. Is repo ki `supabase/schema.sql` file ki **poori** copy-paste karo → **Run** dabao
4. `Success` aana chahiye — tables + 7 categories + settings ready

## Step 2 — Apne aap ko Admin banao (2 minute)

1. Supabase Dashboard → **Authentication** → **Users**
2. `dukandar@gmail.com` wali row me **UID** copy karo
3. **SQL Editor** → New query me ye chalao (UID apna dalna):

```sql
insert into public.admin_users (user_id, email)
values ('PASTE-UID-HERE', 'dukandar@gmail.com')
on conflict (user_id) do nothing;
```

4. Verify: `select * from public.admin_users;` → 1 row dikhni chahiye

> Bina is step ke login hoga par admin panel **nahi** khulega ("not an admin" error aayega).

## Step 3 — Vercel me Env Variables (3 minute)

1. [vercel.com](https://vercel.com) → project **devwood-decore** → **Settings** → **Environment Variables**
2. Ye **2 variables** add karo (naam exact hone chahiye):

| Name | Value (kahan se milegi) |
|------|-------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → Data API → **Project URL** (`https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → Data API → **anon public** key (`sb_publishable_...` se shuru) |

3. Dono me **Production + Preview** tick karo → Save
4. **Deployments** → latest → **⋯** → **Redeploy** (bina redeploy ke naye variables nahi lagenge)

## Step 4 — Login test karo

1. Site kholo → `/admin` (jaise `https://tumhari-site.vercel.app/admin`)
2. Email + password se login karo → Dashboard khulna chahiye
3. Ek test product add karke dekho, phir use delete kar do

## Zaroori notes

- **Publishable key hi use karo** — `service_role` / secret key kabhi frontend ya env me mat dalo
- Photos Supabase Storage (`product-images` bucket) me jati hain — redeploy se **kabhi delete nahi** hongi
- Koi dummy product nahi dala gaya — sab kuch admin panel se tum khud add karoge
