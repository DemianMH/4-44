# Constructora 4:44

Sitio de Constructora 4:44 (inmobiliaria y constructora). Next.js 16 (App Router), Tailwind CSS 4, React Three Fiber y Framer Motion.

```bash
npm install
npm run dev     # desarrollo (panel con contraseña local: admin444)
npm run build
```

## Estructura

- `/` inicio: portada, proyectos, recorridos virtuales, constructora, obra entregada, preguntas y contacto.
- `/proyectos/[slug]` una página por proyecto (galería, día/noche, concepto, recorrido virtual, terraza y contacto).
- `/admin` panel de administración.

## Panel de administración (`/admin`)

Permite editar sin tocar código: datos de la empresa, portada, servicios, formulario, **proyectos** (alta, edición, orden, publicar/ocultar, imágenes, landing, recorrido virtual), obra entregada, preguntas frecuentes y ver los **mensajes** del formulario.

**Configuración en Netlify (obligatoria):**

1. Site configuration → Environment variables → agrega `ADMIN_PASSWORD` con una contraseña larga y única.
2. Opcional: `ADMIN_SECRET` (texto aleatorio para firmar la sesión; si no existe se usa la contraseña).
3. Vuelve a desplegar.

El contenido y las imágenes subidas se guardan en **Netlify Blobs** (sin base de datos externa). En desarrollo se guardan en `.data/` (ignorado por git). El contenido inicial vive en `src/data/content.default.json` y se usa mientras no se guarde nada desde el panel.

Las imágenes del contenido inicial están en `public/p/`. Las que se suben desde el panel se optimizan a WebP (máx. 2560 px) y se sirven desde `/media/…`.
