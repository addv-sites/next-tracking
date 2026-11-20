# Nextracking — Sitio corporativo

Landing page de Nextracking: rastreo satelital, telemetría y protección de flotas
en México. Sitio estático (Vite + Tailwind CSS), optimizado para SEO, CRO y
Core Web Vitals, publicado en GitHub Pages.

**Producción:** https://addv-sites.github.io/next-tracking/

## Stack

- [Vite](https://vitejs.dev/) — build y servidor de desarrollo.
- [Tailwind CSS](https://tailwindcss.com/) (compilado vía PostCSS, sin runtime en el navegador).
- JavaScript vanilla (sin frameworks de UI) para animaciones, modales y formularios.
- [Sharp](https://sharp.pixelplumbing.com/) para procesar y comprimir imágenes a WebP.
- Google Apps Script como backend serverless para la captura de leads.

## Desarrollo local

```bash
npm install
npm run dev        # servidor de desarrollo con hot-reload
npm run build       # build de producción en dist/
npm run preview     # sirve el build de producción localmente
```

El sitio usa `base: '/next-tracking/'` en `vite.config.js` (GitHub Pages
project site). Si se cambia a un dominio propio o a un repo `*.github.io`
raíz, ajustar ese valor.

## Estructura

```
index.html              Página principal (SEO, estructura, contenido)
src/
  main.js                Punto de entrada: importa estilos e inicializa módulos
  styles/main.css         Tailwind + animaciones de scroll-reveal
  modules/
    scrollReveal.js        Animaciones de aparición al hacer scroll (IntersectionObserver)
    loginModal.js           Modal de acceso a la consola (mockup visual, sin autenticación real)
    chatWidget.js            Asistente virtual flotante (reglas simples, sin IA real)
    leadForm.js               Envío del formulario de cotización al backend de leads
  assets/images/            Fotografías e imagen del logo (WebP)
public/                  Archivos estáticos servidos tal cual (favicons, manifest, robots, sitemap)
apps-script/             Backend de leads (Google Apps Script) + guía de despliegue
scripts/                 Utilidades de procesamiento de imágenes (ver abajo)
.github/workflows/       Workflow de build y despliegue a GitHub Pages
desing/                  Especificación de diseño original (tokens, mockup de referencia)
```

## Variables de entorno

Copiar `.env.example` a `.env` (no se sube a git):

```
VITE_LEADS_WEBAPP_URL=   # URL /exec del Google Apps Script (ver apps-script/README.md)
OPENAI_API_KEY=          # Solo para scripts/generate-images.mjs, no se usa en producción
```

Para que el build de GitHub Actions también tenga `VITE_LEADS_WEBAPP_URL`,
agregarla como **Secret** del repositorio: *Settings → Secrets and variables →
Actions → New repository secret*.

## Captura de leads (Google Sheets + correo)

El formulario de cotización envía los datos a un Google Apps Script Web App
que los guarda en una hoja de cálculo y notifica por correo. Instrucciones de
despliegue completas en [`apps-script/README.md`](apps-script/README.md).

## Imágenes

- `scripts/generate-images.mjs` — genera las fotografías del sitio (requiere
  una `OPENAI_API_KEY` propia, se corre una sola vez de forma local, nunca en CI).
- `scripts/process-brand-assets.mjs` — procesa assets de marca entregados en
  PNG (logo, favicon) a WebP/PNG optimizados con fondo transparente.
- `scripts/generate-placeholders.mjs` — genera placeholders de marca mientras
  no existan las imágenes finales, para que el build nunca falle por archivos
  faltantes.

## Despliegue

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
compila el sitio y lo publica en GitHub Pages en cada push a `main`. Requiere
que en *Settings → Pages* la fuente esté configurada como **GitHub Actions**.
