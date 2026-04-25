-- ============================================
-- KEVIN MORALEZ MANAGER - Database Schema
-- ============================================

-- 1. Tabla profiles (enlazada a auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz default now()
);

-- 2. Tabla artist (singleton)
create table if not exists artist (
  id uuid default gen_random_uuid() primary key,
  nombre text not null default 'Kevin Moralez',
  bio text default 'Regional mexicano - Corridos - Covers',
  foto_url text default 'https://images.weserv.nl/?url=i.scdn.co/image/ab67616100005174893a84fa2d1b9ae008fe1eaa',
  spotify_url text default 'https://open.spotify.com/artist/5KxBzNejCjKOwTwB6Dgg7u',
  youtube_url text default 'https://www.youtube.com/@KevinMoralezOficial',
  instagram_url text default 'https://instagram.com/kevinmoralezoficial',
  created_at timestamptz default now()
);

-- 3. Tabla covers
create table if not exists covers (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  artista_original text not null,
  status text not null default 'idea' check (status in ('idea', 'en_progreso', 'grabado', 'editado', 'publicado')),
  fecha_publicacion date,
  youtube_url text,
  imagen_url text,
  notas text,
  checklist jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 4. Tabla agenda (eventos)
create table if not exists agenda (
  id uuid default gen_random_uuid() primary key,
  fecha date not null,
  hora time not null,
  titulo text not null,
  tipo text not null check (tipo in ('Ensayo', 'Grabacion', 'Sesion de fotos', 'Reunion', 'Live/Concierto', 'Otro')),
  notas text,
  hecho boolean default false,
  created_at timestamptz default now()
);

-- 5. Tabla posts (redes sociales)
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  fecha date not null,
  plataforma text not null check (plataforma in ('TikTok', 'Instagram', 'YouTube')),
  tipo text not null check (tipo in ('Video', 'Reel', 'Story', 'Post', 'Short', 'Live')),
  contenido text,
  publicado boolean default false,
  created_at timestamptz default now()
);

-- 6. Tabla metricas
create table if not exists metricas (
  id uuid default gen_random_uuid() primary key,
  plataforma text not null check (plataforma in ('TikTok', 'Instagram', 'YouTube')),
  fecha date not null,
  seguidores integer not null default 0,
  created_at timestamptz default now()
);

-- 7. Tabla contactos
create table if not exists contactos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  rol text,
  telefono text,
  email text,
  notas text,
  created_at timestamptz default now()
);
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
-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para crear profile automaticamente cuando se registra usuario
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, role)
  values (
    new.id,
    new.email,
    case when new.email = 'jhoncrakk1@gmail.com' then 'admin' else 'viewer' end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar artista inicial (solo si no existe)
insert into artist (nombre, bio)
select 'Kevin Moralez', 'Regional mexicano - Corridos - Covers'
where not exists (select 1 from artist limit 1);

-- ============================================
-- REALTIME
-- ============================================

-- Habilitar realtime para las tablas principales
do $$
begin
  -- Solo agregar si no están ya en la publicación
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'covers') then
    alter publication supabase_realtime add table covers;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'agenda') then
    alter publication supabase_realtime add table agenda;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'posts') then
    alter publication supabase_realtime add table posts;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'metricas') then
    alter publication supabase_realtime add table metricas;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'contactos') then
    alter publication supabase_realtime add table contactos;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'artist') then
    alter publication supabase_realtime add table artist;
  end if;
end $$;
