# Devwood Dekor — Supabase Setup Guide (Step by Step)

Ye guide harimohan ke liye hai. Total time: **10-15 minute**. Koi step skip mat karna.

---

## STEP 1: Supabase project banao (2 min)

1. https://supabase.com kholo → **Sign In** (GitHub se login kar lena, wahi account jo abhi connect kiya)
2. **New Project** dabao
3. Name: `devwood-dekor`
4. Database Password: koi strong password do → **likh kar rakh lo**
5. Region: **South Asia (Mumbai)** chuno (India ke visitors ke liye fast)
6. **Create new project** → 1-2 minute me ready ho jayega

## STEP 2: Database tables banao (2 min)

1. Left menu me **SQL Editor** kholo → **New query**
2. Is repo ki file kholo: `supabase/schema.sql` → **poora content copy** karo
3. SQL Editor me paste karo → **Run** dabao (ya Ctrl+Enter)
4. Neeche **"Success. No rows returned"** dikhna chahiye — matlab tables, security rules, photo storage aur default categories sab ban gaye

> Verify karne ke liye: Left menu → **Table Editor** → `categories` me 9 categories dikhni chahiye (Jhula, Bed, Sofa Set...), `settings` me ~20 rows.

## STEP 3: Admin user banao — YEHI ADMIN KA LOGIN HOGA (2 min)

**Admin password Vercel env me rakhne ki zaroorat NAHI hai.** Ye zyada secure tarika hai:

1. Left menu → **Authentication** → **Users** → **Add user** → **Create new user**
2. Email: customer ka email (jaise `devwooddekor@gmail.com`)
3. Password: strong password do → **customer ko de dena, kahin likh kar**
4. **Auto Confirm User** ✅ tick karo → **Create user**

Bas! Ab `admin.html` par isi email+password se login hoga. Password Supabase ke andar encrypted rahega — code me ya env me kahin nahi dikhega.

### STEP 3b: Public signup BAND karo — YE BAHUT ZAROORI HAI (1 min)

Kyunki website ka saara write-access "login kiye hue user" ko mila hai, ye pakka karo ki **koi aur signup karke login na kar paye**:

1. Left menu → **Authentication** → **Providers** → **Email**
2. **"Allow new users to sign up"** → **OFF** kar do → Save

Ab sirf wahi login kar payega jise **tumne** Authentication → Users me manually banaya hai. Koi bahar wala account bana kar admin panel me ghus nahi payega.

## STEP 4: API keys nikalo (1 min)

1. Left menu → **Project Settings** (gear icon) → **API**
2. Copy karo:
   - **Project URL** → jaise `https://xyzabc.supabase.co`
   - **anon public** key → bahut lambi key hai

## STEP 5: Vercel me env variables dalo (2 min)

> **Env variable ke naam (exact same likhna):**
> - `SUPABASE_URL` = Step 4 wala Project URL
> - `SUPABASE_ANON_KEY` = Step 4 wali anon public key

1. https://vercel.com → apna project kholo → **Settings** → **Environment Variables**
2. Dono variables add karo (Production + Preview + Development teeno tick)
3. **Save** → **Deployments** → latest deployment par **⋯ → Redeploy**

> **Note:** `anon` key public-safe hai (Supabase ka design hi aisa hai) — website ke code me rahegi to koi nuksaan nahi, kyunki security rules (RLS) database me lage hain. Sirf `service_role` key kabhi code me mat dalna (wo to hum use hi nahi kar rahe).

> **Vercel use nahi kar rahe?** (jaise GitHub Pages ya Netlify) — to `js/config.js` kholo aur wahan likho:
> ```js
> window.DEVWOOD_CONFIG = {
>   url: "https://xyzabc.supabase.co",
>   anonKey: "tumhari-anon-public-key"
> };
> ```
> Phir commit + push kar do. Vercel par ho to `/api/config` automatic use hota hai — `js/config.js` khaali hi rehne do.

## STEP 6: Test karo

1. `tumhari-site.vercel.app/admin.html` kholo
2. Step 3 wala email+password → **Login**
3. **Products → Add Product** → photo upload karke ek product dalo
4. Website kholo → product dikhna chahiye. Phone se bhi check karo — sab synced dikhega.

---

## Agar kuch gadbad lage

| Problem | Solution |
|---|---|
| Admin login fail ho raha | Authentication → Users me user dikh raha? "Auto Confirm" tick tha? |
| Photo upload fail | SQL dobara run karo (storage policies wahi banti hain) |
| Website par "Supabase connect nahi hua" | Vercel env variables check karo + Redeploy karo |
| Product website par nahi dikh raha | Product me **Active** tick hai? Category **Active** hai? |
