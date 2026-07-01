-- ============================================================================
--  Analítica de tráfico — Mundo Alimeythor
--  Ejecutar UNA vez en: Supabase → tu proyecto → SQL Editor → New query → Run
-- ============================================================================

-- 1) Tabla donde se guardan las visitas
create table if not exists public.pageviews (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  path        text        not null,
  referrer    text,
  visitor_id  text,        -- id anónimo por navegador (para visitantes únicos)
  device      text,        -- 'mobile' | 'desktop'
  ua          text
);

-- 2) Índices para que el panel consulte rápido
create index if not exists pageviews_created_at_idx on public.pageviews (created_at desc);
create index if not exists pageviews_path_idx       on public.pageviews (path);

-- 3) Seguridad a nivel de fila
alter table public.pageviews enable row level security;

-- 3a) Permitir que la web (clave anónima) INSERTE visitas
drop policy if exists "anon insert pageviews" on public.pageviews;
create policy "anon insert pageviews"
  on public.pageviews for insert
  to anon
  with check (true);

-- 3b) Permitir que el panel (clave anónima) LEA las visitas
--     El panel es de acceso libre, por eso el select es anónimo.
--     Los datos no son personales (rutas, id anónimo, dispositivo).
drop policy if exists "anon select pageviews" on public.pageviews;
create policy "anon select pageviews"
  on public.pageviews for select
  to anon
  using (true);
