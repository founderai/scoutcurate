-- Migration 002: Recommendation aggregate tables

-- product_metrics_daily
create table if not exists product_metrics_daily (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  day date not null,
  views int not null default 0,
  clicks int not null default 0,
  saves int not null default 0,
  outbound_clicks int not null default 0,
  conversions int not null default 0,
  ctr numeric not null default 0,
  conversion_rate numeric not null default 0,
  updated_at timestamptz default now(),
  unique (product_id, day)
);
create index if not exists idx_pmd_product_id on product_metrics_daily(product_id);
create index if not exists idx_pmd_day on product_metrics_daily(day);

-- product_affinity_signals
create table if not exists product_affinity_signals (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  recipient_type text,
  occasion text,
  style_tag text,
  affinity_score numeric not null default 0,
  sample_size int not null default 0,
  updated_at timestamptz default now(),
  unique (product_id, recipient_type, occasion, style_tag)
);
create index if not exists idx_pas_product_id on product_affinity_signals(product_id);
create index if not exists idx_pas_recipient_type on product_affinity_signals(recipient_type);

-- RLS
alter table product_metrics_daily enable row level security;
alter table product_affinity_signals enable row level security;

-- service role only (aggregation jobs run server-side with service key)
create policy "service insert product_metrics_daily"
  on product_metrics_daily for all using (true) with check (true);
create policy "service insert product_affinity_signals"
  on product_affinity_signals for all using (true) with check (true);
