-- ==========================================================================
-- DEVWOOD DEKOR — Supabase Database Schema
-- ==========================================================================
-- Chalane ka tarika:
--   1. https://supabase.com → apna project kholo (devwood-dekor)
--   2. Left menu → "SQL Editor" → "New query"
--   3. Ye poori file copy-paste karo → "Run" dabao
--   4. "Success" aana chahiye. Bas, database ready!
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. CATEGORIES — website par dikhne wali main categories
--    (Jhula, Bed, Kitchen Items... sab admin panel se manage hongi)
-- --------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                       -- e.g. "Jhula"
  slug        text not null unique,                -- e.g. "jhula" (URL/filter me use hoga)
  image_url   text,                                -- category card ki photo (admin panel se upload)
  sort_order  int not null default 0,             -- chhota number = pehle dikhega
  is_active   boolean not null default true,      -- false = website par chhupa do
  created_at  timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 2. PRODUCTS — saare wooden products
-- --------------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                       -- product ka naam
  category_id uuid references public.categories(id) on delete set null,
  price       int not null default 0,             -- bikne wala daam (₹ me)
  mrp         int,                                 -- kata hua purana daam (discount dikhane ke liye)
  badge       text,                                -- e.g. "Best Seller", "New Arrival" (khali bhi chalega)
  wood_type   text,                                -- e.g. "Solid Sheesham Wood"
  dimensions  text,                                -- e.g. '72" L x 36" W x 40" H'
  finish      text,                                -- e.g. "Teak Brown Polish"
  description text,                                -- product ke baare me jaankari
  images      text[] not null default '{}',       -- photo URLs (pehli photo = main photo)
  is_featured boolean not null default false,    -- true = homepage par "Featured" me dikhega
  is_active   boolean not null default true,      -- false = website par chhupa do (delete nahi hoga)
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 3. SETTINGS — phone, address, WhatsApp number, hero text... sab kuch
--    Admin panel ke "Settings" page se badla jayega.
-- --------------------------------------------------------------------------
create table if not exists public.settings (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 4. SECURITY (Row Level Security)
--    - Website visitor: sirf ACTIVE products/categories/settings DEKH sakta hai
--    - Admin (login ke baad): sab kuch add/edit/delete kar sakta hai
-- --------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.settings   enable row level security;

-- Categories policies
drop policy if exists "public read active categories" on public.categories;
create policy "public read active categories"
  on public.categories for select using (is_active = true);

drop policy if exists "admin manage categories" on public.categories;
create policy "admin manage categories"
  on public.categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Products policies
drop policy if exists "public read active products" on public.products;
create policy "public read active products"
  on public.products for select using (is_active = true);

drop policy if exists "admin manage products" on public.products;
create policy "admin manage products"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Settings policies (settings hamesha public padh sakta hai, likh sirf admin)
drop policy if exists "public read settings" on public.settings;
create policy "public read settings"
  on public.settings for select using (true);

drop policy if exists "admin manage settings" on public.settings;
create policy "admin manage settings"
  on public.settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- --------------------------------------------------------------------------
-- 5. PHOTO STORAGE — product/category ki photos yahan upload hongi
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
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- --------------------------------------------------------------------------
-- 6. DEFAULT CATEGORIES — shuruaat ke liye taiyaar
--    (Admin panel se naam/photo badal sakte ho, nayi add kar sakte ho)
-- --------------------------------------------------------------------------
insert into public.categories (name, slug, sort_order) values
  ('Jhula',            'jhula',     1),
  ('Bed',              'bed',       2),
  ('Sofa Set',         'sofa',      3),
  ('Dining Table',     'dining',    4),
  ('Wardrobe / Almari','wardrobe',  5),
  ('Mandir',           'mandir',    6),
  ('Kitchen Items',    'kitchen',   7),
  ('Office Furniture', 'office',    8),
  ('Wall Decor',       'wall-decor',9)
on conflict (slug) do nothing;

-- --------------------------------------------------------------------------
-- 7. DEFAULT SETTINGS — purani website ka data pehle se bhara hua
--    (Admin panel → Settings se sab badal sakte ho)
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
