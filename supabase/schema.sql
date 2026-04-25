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
