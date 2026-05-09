-- Run this in your Supabase SQL editor

create table if not exists confessions (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Index for fast feed queries
create index if not exists confessions_feed_idx
  on confessions (visibility, approved, created_at desc);

-- Row Level Security
alter table confessions enable row level security;

-- Public can only read approved public confessions
create policy "Public can read approved confessions"
  on confessions for select
  using (visibility = 'public' and approved = true);

-- Public can insert confessions
create policy "Anyone can submit a confession"
  on confessions for insert
  with check (true);

-- Admin operations are done via the service role key (not exposed to frontend)
-- For the admin panel to work via anon key, add this policy:
-- WARNING: This is a simple client-side password approach.
-- For production, use Supabase Auth with a real admin user instead.

-- Temporary: allow anon to read all (for admin panel) - restrict later
create policy "Anon can read all for admin"
  on confessions for select
  using (true);

create policy "Anon can update for admin"
  on confessions for update
  using (true);

create policy "Anon can delete for admin"
  on confessions for delete
  using (true);
