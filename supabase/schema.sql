-- ==========================================================================
-- DEVWOOD DEKOR — Supabase Database Schema v2 (Next.js)
-- ==========================================================================
-- Chalane ka tarika:
--   1. https://supabase.com → apna project kholo
--   2. Left menu → "SQL Editor" → "New query"
--   3. Ye poori file copy-paste karo → "Run" dabao
--   4. "Success" aana chahiye. Dobara chalana safe hai.
--
-- Uske baad: neeche STEP 8 me apne admin user ka UID allowlist me dalna hai.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. CATEGORIES
-- --------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  image_url   text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 2. PRODUCTS
-- --------------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category_id uuid references public.categories(id) on delete set null,
  price       int not null default 0,
  mrp         int,
  badge       text,
  wood_type   text,
  dimensions  text,
  finish      text,
  description text,
  images      text[] not null default '{}',
  is_featured boolean not null default false,
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- slug column (purane projects ke liye migration)
alter table public.products add column if not exists slug text;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_slug_key') then
    alter table public.products add constraint products_slug_key unique (slug);
  end if;
end $$;

-- --------------------------------------------------------------------------
-- 3. SETTINGS
-- --------------------------------------------------------------------------
create table if not exists public.settings (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 4. ADMIN ALLOWLIST — sirf ye users admin panel chala sakte hain
--    Apna UID STEP 8 me dalna hai (neeche dekho).
-- --------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- Helper: kya current logged-in user allowlisted admin hai?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- --------------------------------------------------------------------------
-- 5. SECURITY (Row Level Security)
--    - Visitor: sirf ACTIVE products/categories aur settings DEKH sakta hai
--    - Allowlisted admin: sab kuch add/edit/delete kar sakta hai
--    - Koi bhi random logged-in user kuch nahi badal sakta
-- --------------------------------------------------------------------------
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.settings    enable row level security;
alter table public.admin_users enable row level security;

-- categories
drop policy if exists "public read active categories" on public.categories;
create policy "public read active categories"
  on public.categories for select using (is_active = true);
drop policy if exists "admin manage categories" on public.categories;
create policy "admin manage categories"
  on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- products
drop policy if exists "public read active products" on public.products;
create policy "public read active products"
  on public.products for select using (is_active = true);
drop policy if exists "admin manage products" on public.products;
create policy "admin manage products"
  on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- settings (padh sab sakte hain, likh sirf admin)
drop policy if exists "public read settings" on public.settings;
create policy "public read settings"
  on public.settings for select using (true);
drop policy if exists "admin manage settings" on public.settings;
create policy "admin manage settings"
  on public.settings for all
  using (public.is_admin()) with check (public.is_admin());

-- admin_users: user sirf apni khud ki row dekh sakta hai.
-- Insert/update/delete sirf SQL Editor (service role) se — app se nahi.
drop policy if exists "users read own allowlist row" on public.admin_users;
create policy "users read own allowlist row"
  on public.admin_users for select using (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- 6. PHOTO STORAGE
-- --------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select using (bucket_id = 'product-images');

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- --------------------------------------------------------------------------
-- 7. CATEGORIES — purani 9 ki jagah nayi 7 (English)
--    Purane slugs ko naye naam me badal do; bekar wali khali categories hatao.
-- --------------------------------------------------------------------------
update public.categories set slug = 'dining-table',  name = 'Dining Table'
  where slug = 'dining';
update public.categories set slug = 'kitchen-items', name = 'Kitchen Items'
  where slug = 'kitchen';

delete from public.categories
where slug in ('sofa', 'wardrobe', 'mandir', 'office', 'wall-decor')
  and not exists (
    select 1 from public.products p where p.category_id = public.categories.id
  );

insert into public.categories (name, slug, sort_order) values
  ('Wall Clock',      'wall-clock',      1),
  ('Bed',             'bed',             2),
  ('Jhula',           'jhula',           3),
  ('Dining Table',    'dining-table',    4),
  ('Telephone',       'telephone',       5),
  ('Electronic Items','electronic-items',6),
  ('Kitchen Items',   'kitchen-items',   7)
on conflict (slug) do update
  set name = excluded.name, sort_order = excluded.sort_order;

-- --------------------------------------------------------------------------
-- 8. DEFAULT SETTINGS — dukandar ka asli business data
-- --------------------------------------------------------------------------
insert into public.settings (key, value) values
  ('site_name',      'Devwood Dekor'),
  ('tagline',        'ROYAL WOODCRAFT & ANTIQUES'),
  ('phone',          '+91 9783656009'),
  ('whatsapp',       '919783656009'),
  ('address',        'Taranagar Road, 1 KM from Sardarshahar Circle, Sardarshahar, Rajasthan'),
  ('map_url',        ''),
  ('announcement',   ''),
  ('hero_badge',     'Authentic Rajasthani Craftsmanship'),
  ('hero_title',     'Timeless Solid Wood & Royal Antiques'),
  ('hero_subtitle',  'Transform your home with generational Sheesham & Teak wood furniture and century-old restored Rajasthani artefacts, handcrafted with pride in Sardarshahar.'),
  ('hero_image',     ''),
  ('about_title',    'The Art of Sardarshahar Woodcraft'),
  ('about_text',     'Sardarshahar, located in the historic Churu district of Rajasthan, has long been revered as an epicenter of Indian hardwood craft. For centuries, the royal havelis and merchant palaces of Shekhawati stood adorned with hand-chiseled wooden doors, magnificent arches, and brass-studded timber chests that braved the harsh desert climate with unmatched dignity.'),
  ('about_image',    ''),
  ('facebook',       ''),
  ('instagram',      ''),
  ('youtube',        ''),
  ('logo_url',       ''),
  ('footer_text',    'Direct Inquiries: +91 9783656009 | Taranagar Road, 1 KM from Sardarshahar Circle')
on conflict (key) do nothing;

-- ==========================================================================
-- STEP 8 (zaroori): APNE ADMIN USER KO ALLOWLIST ME DALO
-- ==========================================================================
-- 1. Supabase Dashboard → Authentication → Users
-- 2. Apne admin user (dukandar@gmail.com) ki row me UID copy karo
-- 3. Neeche 'PASTE-UID-HERE' ki jagah wo UID dalkar ye query chalao:
--
--    insert into public.admin_users (user_id, email)
--    values ('PASTE-UID-HERE', 'dukandar@gmail.com')
--    on conflict (user_id) do nothing;
--
-- Verify:  select * from public.admin_users;  → 1 row dikhni chahiye
-- ==========================================================================
