-- ScoutCurate Intent Capture Schema

create extension if not exists "pgcrypto";

-- user_sessions
create table if not exists user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  session_id text not null,
  created_at timestamptz default now()
);
create index if not exists idx_user_sessions_session_id on user_sessions(session_id);

-- gift_intents
create table if not exists gift_intents (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id text,
  recipient_type text,
  occasion text,
  budget_min int,
  budget_max int,
  style_tags text[],
  created_at timestamptz default now()
);
create index if not exists idx_gift_intents_session_id on gift_intents(session_id);

-- product_events
create table if not exists product_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id text,
  product_id text not null,
  event_type text not null, -- view | click | save | outbound_click
  position int,
  metadata jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_product_events_session_id on product_events(session_id);
create index if not exists idx_product_events_event_type on product_events(event_type);

-- conversions
create table if not exists conversions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id text,
  product_id text not null,
  affiliate_url text,
  estimated_value numeric,
  created_at timestamptz default now()
);
create index if not exists idx_conversions_session_id on conversions(session_id);

-- RLS: enable but allow anon inserts (service role for reads)
alter table user_sessions enable row level security;
alter table gift_intents enable row level security;
alter table product_events enable row level security;
alter table conversions enable row level security;

create policy "anon insert user_sessions" on user_sessions for insert with check (true);
create policy "anon insert gift_intents" on gift_intents for insert with check (true);
create policy "anon insert product_events" on product_events for insert with check (true);
create policy "anon insert conversions" on conversions for insert with check (true);
