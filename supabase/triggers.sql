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
