create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  department text not null,
  description text default '',
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.company_events (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  created_at timestamptz not null default now()
);

alter table public.employees enable row level security;
alter table public.company_events enable row level security;

create policy "Public can view employees" on public.employees for select using (true);
create policy "Authenticated admins manage employees" on public.employees for all to authenticated using (true) with check (true);
create policy "Public can view company events" on public.company_events for select using (true);
create policy "Authenticated admins manage company events" on public.company_events for all to authenticated using (true) with check (true);
