-- ============================================================
-- Esquema para la tienda de Cacao Amargo
-- Ejecuta este archivo completo en Supabase: Dashboard > SQL Editor
-- ============================================================

-- 1) Tabla de productos
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2),
  cacao_percentage smallint check (cacao_percentage between 0 and 100),
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Activar Row Level Security
alter table public.products enable row level security;

-- 3) Cualquiera (público, sin login) puede LEER solo productos disponibles
create policy "Productos disponibles son públicos"
  on public.products
  for select
  to anon, authenticated
  using (is_available = true);

-- 4) Solo usuarios autenticados (el administrador) pueden ver TODO,
--    incluyendo productos ocultos, para gestionarlos en el panel
create policy "Administradores ven todos los productos"
  on public.products
  for select
  to authenticated
  using (true);

-- 5) Solo usuarios autenticados pueden insertar, actualizar o eliminar
create policy "Administradores insertan productos"
  on public.products
  for insert
  to authenticated
  with check (true);

create policy "Administradores actualizan productos"
  on public.products
  for update
  to authenticated
  using (true);

create policy "Administradores eliminan productos"
  on public.products
  for delete
  to authenticated
  using (true);

-- ============================================================
-- 6) Bucket de almacenamiento para las imágenes de productos
--    (puedes crearlo también desde Dashboard > Storage > New bucket,
--    marcado como "Public")
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Cualquiera puede VER las imágenes (el bucket es público)
create policy "Imágenes de productos son públicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Solo usuarios autenticados pueden subir imágenes
create policy "Administradores suben imágenes"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- Solo usuarios autenticados pueden borrar imágenes
create policy "Administradores eliminan imágenes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ============================================================
-- 7) Crea tu usuario administrador desde:
--    Dashboard > Authentication > Users > Add user
--    (usa ese correo y contraseña para entrar en /admin/login)
-- ============================================================
