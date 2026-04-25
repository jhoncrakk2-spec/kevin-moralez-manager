-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
alter table profiles enable row level security;
alter table artist enable row level security;
alter table covers enable row level security;
alter table agenda enable row level security;
alter table posts enable row level security;
alter table metricas enable row level security;
alter table contactos enable row level security;

-- Funcion helper para verificar si es admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Policies para profiles
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Policies para artist (todos leen, solo admin escribe)
drop policy if exists "Anyone authenticated can view artist" on artist;
create policy "Anyone authenticated can view artist" on artist for select using (auth.uid() is not null);
drop policy if exists "Only admin can update artist" on artist;
create policy "Only admin can update artist" on artist for update using (is_admin());

-- Policies para covers
drop policy if exists "Anyone authenticated can view covers" on covers;
create policy "Anyone authenticated can view covers" on covers for select using (auth.uid() is not null);
drop policy if exists "Only admin can insert covers" on covers;
create policy "Only admin can insert covers" on covers for insert with check (is_admin());
drop policy if exists "Only admin can update covers" on covers;
create policy "Only admin can update covers" on covers for update using (is_admin());
drop policy if exists "Only admin can delete covers" on covers;
create policy "Only admin can delete covers" on covers for delete using (is_admin());

-- Policies para agenda
drop policy if exists "Anyone authenticated can view agenda" on agenda;
create policy "Anyone authenticated can view agenda" on agenda for select using (auth.uid() is not null);
drop policy if exists "Only admin can insert agenda" on agenda;
create policy "Only admin can insert agenda" on agenda for insert with check (is_admin());
drop policy if exists "Only admin can update agenda" on agenda;
create policy "Only admin can update agenda" on agenda for update using (is_admin());
drop policy if exists "Only admin can delete agenda" on agenda;
create policy "Only admin can delete agenda" on agenda for delete using (is_admin());

-- Policies para posts
drop policy if exists "Anyone authenticated can view posts" on posts;
create policy "Anyone authenticated can view posts" on posts for select using (auth.uid() is not null);
drop policy if exists "Only admin can insert posts" on posts;
create policy "Only admin can insert posts" on posts for insert with check (is_admin());
drop policy if exists "Only admin can update posts" on posts;
create policy "Only admin can update posts" on posts for update using (is_admin());
drop policy if exists "Only admin can delete posts" on posts;
create policy "Only admin can delete posts" on posts for delete using (is_admin());

-- Policies para metricas
drop policy if exists "Anyone authenticated can view metricas" on metricas;
create policy "Anyone authenticated can view metricas" on metricas for select using (auth.uid() is not null);
drop policy if exists "Only admin can insert metricas" on metricas;
create policy "Only admin can insert metricas" on metricas for insert with check (is_admin());
drop policy if exists "Only admin can delete metricas" on metricas;
create policy "Only admin can delete metricas" on metricas for delete using (is_admin());

-- Policies para contactos
drop policy if exists "Anyone authenticated can view contactos" on contactos;
create policy "Anyone authenticated can view contactos" on contactos for select using (auth.uid() is not null);
drop policy if exists "Only admin can insert contactos" on contactos;
create policy "Only admin can insert contactos" on contactos for insert with check (is_admin());
drop policy if exists "Only admin can update contactos" on contactos;
create policy "Only admin can update contactos" on contactos for update using (is_admin());
drop policy if exists "Only admin can delete contactos" on contactos;
create policy "Only admin can delete contactos" on contactos for delete using (is_admin());
