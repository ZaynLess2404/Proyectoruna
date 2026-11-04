# Runa® — Landing page

Landing page de una sola página para un estudio/negocio de servicios.
HTML, CSS y JavaScript puros, sin dependencias ni build step.

## Cómo verla

- Abrí `index.html` con doble clic en el navegador, o
- Desde la terminal: `python -m http.server 5500` y visitá `http://localhost:5500`

## Archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura y textos de todas las secciones |
| `styles.css` | Diseño, variables de color, animaciones y responsive |
| `script.js` | Menú móvil, scroll reveal, contadores, FAQ y formulario |

## Personalización rápida

- **Textos y secciones:** editá `index.html`.
- **Colores:** en `styles.css`, bloque `:root`:
  - `--bg`, `--surface`: fondos.
  - `--accent`: color de marca (por defecto lima `#d7ff3e`).
  - `--text`, `--muted`: colores de texto.
- **Tipografías:** se cargan desde Google Fonts en el `<head>`
  (Space Grotesk, Inter e Instrument Serif).
- **Datos de contacto:** buscá `hola@runa.studio`, `wa.me` y la dirección en
  `index.html` (sección Contacto y footer).
- **Casos del portfolio:** reemplazá los bloques `.work-card`. Las imágenes
  actuales son fondos CSS; podés cambiarlas por `<img>` si preferís.

## Formulario

El envío está **simulado** (no envía emails). Para conectarlo:

1. Elegí un servicio (Formspree, Resend, EmailJS, tu backend, etc.).
2. Enviá los datos desde el listener `submit` de `script.js`.
3. Mientras tanto, el formulario valida nombre, email y mensaje, muestra
   errores accesibles y un estado de éxito.

## Detalles incluidos

- Diseño responsive (móvil, tablet y escritorio) sin scroll horizontal.
- Menú móvil accesible con cierre por `Escape`.
- Animaciones de entrada con `IntersectionObserver` y soporte para
  `prefers-reduced-motion`.
- Acordeón FAQ con ARIA.
- Auditoría Lighthouse: 100 en Accesibilidad, Best Practices y SEO.
