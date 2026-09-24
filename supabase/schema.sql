-- =====================================================================
-- PRIME DEALS — database schema
-- Run this in the Supabase SQL editor, then run seed.sql
-- =====================================================================

create extension if not exists "pgcrypto";

-- ------------------------------ profiles -----------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin','editor','agent','user')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_staff()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','editor','agent')
  );
$$;

-- ------------------------------ projects -----------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null, name_ar text not null,
  location_en text not null, location_ar text not null,
  body_en text, body_ar text,
  unit_types_en text, unit_types_ar text,
  delivery_year int,
  price_from numeric,
  images text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------- properties ----------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null, title_ar text not null,
  description_en text, description_ar text,
  location_en text not null, location_ar text not null,
  type text not null check (type in ('apartment','villa','townhouse','chalet','office')),
  listing text not null default 'sale' check (listing in ('sale','rent','resale','primary')),
  price numeric not null,
  per_month boolean not null default false,
  bedrooms int not null default 0,
  bathrooms int not null default 0,
  area_sqft int not null default 0,
  lat double precision, lng double precision,
  amenities_en text[] not null default '{}',
  amenities_ar text[] not null default '{}',
  images text[] not null default '{}',
  project_id uuid references public.projects on delete set null,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists properties_filter_idx on public.properties (type, bedrooms, price, published);

-- ------------------------------- posts -------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null, title_ar text not null,
  excerpt_en text, excerpt_ar text,
  body_en text, body_ar text,
  cover text,
  author_id uuid references public.profiles on delete set null,
  published_at timestamptz default now(),
  published boolean not null default true
);

-- ------------------- team / faqs / jobs / locations -------------------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name_en text not null, name_ar text not null,
  role_en text not null, role_ar text not null,
  phone text, email text, photo text,
  sort_order int not null default 0
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question_en text not null, question_ar text not null,
  answer_en text not null, answer_ar text not null,
  sort_order int not null default 0
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title_en text not null, title_ar text not null,
  meta_en text not null, meta_ar text not null,
  body_en text not null, body_ar text not null,
  published boolean not null default true
);

create table if not exists public.offices (
  id uuid primary key default gen_random_uuid(),
  name_en text not null, name_ar text not null,
  address_en text not null, address_ar text not null,
  phone text, lat double precision, lng double precision
);

-- ------------------- page content (dashboard-editable) ---------------
create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  key text not null,
  content_en jsonb not null default '{}',
  content_ar jsonb not null default '{}',
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (page, key)
);

create table if not exists public.seo_meta (
  id uuid primary key default gen_random_uuid(),
  page text unique not null,
  title_en text not null, title_ar text not null,
  description_en text not null, description_ar text not null,
  og_image text
);

-- Free-form UI string overrides edited from the dashboard "Translations" tab
create table if not exists public.translations (
  id uuid primary key default gen_random_uuid(),
  namespace text not null,
  key text not null,
  value_en text not null,
  value_ar text not null,
  unique (namespace, key)
);

-- ------------------------- leads & favourites ------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  property_id uuid references public.properties on delete set null,
  source text not null default 'contact',
  status text not null default 'new' check (status in ('new','contacted','won','lost')),
  created_at timestamptz not null default now()
);

create table if not exists public.favourites (
  user_id uuid not null references auth.users on delete cascade,
  property_id uuid not null references public.properties on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles       enable row level security;
alter table public.properties     enable row level security;
alter table public.projects       enable row level security;
alter table public.posts          enable row level security;
alter table public.team_members   enable row level security;
alter table public.faqs           enable row level security;
alter table public.jobs           enable row level security;
alter table public.offices        enable row level security;
alter table public.page_sections  enable row level security;
alter table public.seo_meta       enable row level security;
alter table public.translations   enable row level security;
alter table public.leads          enable row level security;
alter table public.favourites     enable row level security;
alter table public.subscribers    enable row level security;

-- Public read for published content
do $$
declare t text;
begin
  foreach t in array array['properties','projects','posts'] loop
    execute format('drop policy if exists read_published on public.%I', t);
    execute format('create policy read_published on public.%I for select using (published = true or public.is_staff())', t);
    execute format('drop policy if exists staff_write on public.%I', t);
    execute format('create policy staff_write on public.%I for all using (public.is_staff()) with check (public.is_staff())', t);
  end loop;

  foreach t in array array['team_members','faqs','jobs','offices','page_sections','seo_meta','translations'] loop
    execute format('drop policy if exists read_all on public.%I', t);
    execute format('create policy read_all on public.%I for select using (true)', t);
    execute format('drop policy if exists staff_write on public.%I', t);
    execute format('create policy staff_write on public.%I for all using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

-- Profiles: own row readable/updatable, staff sees all
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles for select using (id = auth.uid() or public.is_staff());
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update using (id = auth.uid() or public.is_staff());

-- Leads: anyone can create, only staff can read
drop policy if exists leads_insert_any on public.leads;
create policy leads_insert_any on public.leads for insert with check (true);
drop policy if exists leads_staff_read on public.leads;
create policy leads_staff_read on public.leads for all using (public.is_staff()) with check (public.is_staff());

-- Favourites: owner only
drop policy if exists fav_owner on public.favourites;
create policy fav_owner on public.favourites for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Subscribers: anyone can subscribe, staff can read
drop policy if exists sub_insert_any on public.subscribers;
create policy sub_insert_any on public.subscribers for insert with check (true);
drop policy if exists sub_staff_read on public.subscribers;
create policy sub_staff_read on public.subscribers for select using (public.is_staff());

-- =====================================================================
-- STORAGE  (create the bucket in Dashboard > Storage, name: media)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists media_staff_write on storage.objects;
create policy media_staff_write on storage.objects
  for all using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

-- =====================================================================
-- v2 — reviews, richer job records, applications, CV storage
-- Safe to run on top of the original schema.
-- =====================================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name_en text not null, name_ar text not null,
  role_en text not null, role_ar text not null,
  quote_en text not null, quote_ar text not null,
  rating int not null default 5 check (rating between 1 and 5),
  photo text,
  featured boolean not null default true,
  sort_order int not null default 0
);

-- Jobs gain a slug and the full posting body
alter table public.jobs add column if not exists slug text;
alter table public.jobs add column if not exists department_en text;
alter table public.jobs add column if not exists department_ar text;
alter table public.jobs add column if not exists location_en text;
alter table public.jobs add column if not exists location_ar text;
alter table public.jobs add column if not exists employment_type text default 'full_time';
alter table public.jobs add column if not exists experience_en text;
alter table public.jobs add column if not exists experience_ar text;
alter table public.jobs add column if not exists salary_en text;
alter table public.jobs add column if not exists salary_ar text;
alter table public.jobs add column if not exists responsibilities_en text[] default '{}';
alter table public.jobs add column if not exists responsibilities_ar text[] default '{}';
alter table public.jobs add column if not exists requirements_en text[] default '{}';
alter table public.jobs add column if not exists requirements_ar text[] default '{}';
alter table public.jobs add column if not exists benefits_en text[] default '{}';
alter table public.jobs add column if not exists benefits_ar text[] default '{}';
alter table public.jobs add column if not exists posted_at timestamptz default now();

update public.jobs
set slug = lower(regexp_replace(title_en, '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null;

create unique index if not exists jobs_slug_key on public.jobs (slug);

-- Job applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs on delete set null,
  job_slug text,
  full_name text not null,
  email text not null,
  phone text not null,
  location text,
  linkedin text,
  years_experience int,
  current_position text,
  notice_period text,
  expected_salary text,
  cv_url text,
  cv_name text,
  notes text,
  status text not null default 'new' check (status in ('new','screening','interview','offer','rejected')),
  created_at timestamptz not null default now()
);
create index if not exists applications_job_idx on public.applications (job_id, status);

-- Properties gain the 360 tour + richer detail fields
alter table public.properties add column if not exists tour_360_url text;
alter table public.properties add column if not exists reference_code text;
alter table public.properties add column if not exists finishing_en text;
alter table public.properties add column if not exists finishing_ar text;
alter table public.properties add column if not exists delivery_en text;
alter table public.properties add column if not exists delivery_ar text;
alter table public.properties add column if not exists rooms jsonb default '[]';
alter table public.properties add column if not exists nearby jsonb default '[]';
alter table public.properties add column if not exists down_payment_pct numeric default 10;
alter table public.properties add column if not exists instalment_years int default 7;

update public.properties
set reference_code = 'PD-' || substr(replace(id::text, '-', ''), 1, 6)
where reference_code is null;

-- RLS for the new tables
alter table public.reviews enable row level security;
alter table public.applications enable row level security;

drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select using (true);
drop policy if exists reviews_write on public.reviews;
create policy reviews_write on public.reviews for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists applications_insert_any on public.applications;
create policy applications_insert_any on public.applications for insert with check (true);
drop policy if exists applications_staff on public.applications;
create policy applications_staff on public.applications for all using (public.is_staff()) with check (public.is_staff());

-- Private bucket for CVs (never publicly listable)
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;

drop policy if exists cvs_insert_any on storage.objects;
create policy cvs_insert_any on storage.objects
  for insert with check (bucket_id = 'cvs');

drop policy if exists cvs_staff_read on storage.objects;
create policy cvs_staff_read on storage.objects
  for select using (bucket_id = 'cvs' and public.is_staff());
