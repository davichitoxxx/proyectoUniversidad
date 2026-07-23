# Cacao Amargo — Tienda online

Tienda minimalista para promocionar y vender productos de cacao amargo.
Incluye:

- **Tienda pública** (`/`): catálogo de productos disponibles + botón de compra directo a WhatsApp.
- **Panel administrativo** (`/admin`): login, subir/editar/eliminar productos e imágenes.
- **Supabase** como base de datos, autenticación y almacenamiento de imágenes.

Stack: React + Vite + Tailwind CSS + Supabase.

---

## 1. Crear el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**.
2. Cuando esté listo, entra a **SQL Editor** y pega/ejecuta todo el contenido de
   [`supabase/schema.sql`](./supabase/schema.sql). Esto crea:
   - la tabla `products`,
   - las políticas de seguridad (RLS): el público solo ve productos disponibles, solo tú (autenticado) puedes crear/editar/borrar,
   - el bucket público `product-images` para las fotos.
3. Ve a **Authentication → Users → Add user** y crea tu usuario administrador (correo + contraseña). Con esas credenciales entrarás en `/admin/login`.
4. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - `anon public key`

## 2. Configurar el proyecto localmente

```bash
# 1. Instala dependencias
npm install

# 2. Copia el archivo de variables de entorno
cp .env.example .env
```

Edita `.env` con tus datos:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
VITE_WHATSAPP_NUMBER=593999999999
```

`VITE_WHATSAPP_NUMBER` debe ser el número de WhatsApp de ventas, con código de país y sin espacios ni "+".

```bash
# 3. Ejecuta en desarrollo
npm run dev
```

Abre `http://localhost:5173` para la tienda y `http://localhost:5173/admin` para el panel.

## 3. Subir el código a GitHub

```bash
git init
git add .
git commit -m "Tienda de cacao amargo"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

**Importante:** el archivo `.env` está en `.gitignore` y nunca se sube al repositorio, ya que contiene tus claves. En su lugar, cada plataforma de despliegue te dejará configurar esas mismas variables desde su panel (paso siguiente).

## 4. Publicar la tienda (recomendado: Vercel)

1. Entra a [vercel.com](https://vercel.com) → **Add New Project** → importa tu repositorio de GitHub.
2. En **Environment Variables**, agrega las tres variables del `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WHATSAPP_NUMBER`).
3. Deploy. Vercel detecta Vite automáticamente.

También funciona igual en Netlify o Cloudflare Pages, usando el mismo comando de build:

```
Build command: npm run build
Output directory: dist
```

## 5. Uso diario

- Entra a `tu-dominio.com/admin/login`, inicia sesión con tu usuario de Supabase.
- Crea un producto: nombre, descripción, precio, % de cacao, imagen y si está visible o no.
- El producto aparece automáticamente en la tienda pública si está marcado como "Visible".
- Cada tarjeta de producto tiene un botón "Comprar por WhatsApp" que abre un chat con el mensaje ya redactado con el nombre del producto.

## Estructura del proyecto

```
src/
  components/       ProductCard, botones de WhatsApp
  pages/
    Home.jsx        Tienda pública
    Admin.jsx        Panel administrativo (protegido)
    AdminLogin.jsx    Login del panel
  lib/supabaseClient.js
supabase/schema.sql  Esquema SQL a ejecutar en Supabase
```

## Notas de seguridad

- La tabla `products` usa Row Level Security: el público (sin sesión) solo puede leer productos con `is_available = true`. Crear, editar, eliminar y ver productos ocultos requiere estar autenticado.
- No existe registro público de usuarios: los administradores se crean manualmente desde el Dashboard de Supabase.
