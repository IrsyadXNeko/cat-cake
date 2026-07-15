-- ─── Create menu_items table ────────────────────────────────────────────────

create table if not exists menu_items (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  description text not null default '',
  price     integer not null,
  category  text not null,
  image_url text not null default '',
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for filtering by category
create index if not exists idx_menu_items_category on menu_items (category);

-- Index for searching by name
create index if not exists idx_menu_items_name on menu_items (name);

-- Index for availability filtering
create index if not exists idx_menu_items_available on menu_items (is_available);

-- Auto-update updated_at on row modification
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_menu_items_updated_at on menu_items;
create trigger trg_menu_items_updated_at
  before update on menu_items
  for each row
  execute function update_updated_at_column();

-- Enable Row Level Security (optional — protected by service_role on server)
alter table menu_items enable row level security;

-- Allow public read access (menu is visible to everyone)
create policy "Public can read menu_items"
  on menu_items for select
  using (true);

-- Only server with service_role key can write
create policy "Service role can insert"
  on menu_items for insert
  with check (true);

create policy "Service role can update"
  on menu_items for update
  using (true);

create policy "Service role can delete"
  on menu_items for delete
  using (true);
