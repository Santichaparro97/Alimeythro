# Estructura del proyecto — Mundo Alimeythor

Guía rápida para encontrar dónde modificar cada cosa.

---

## 📁 Árbol de archivos

```
mundo-alimeythor/
├── index.html                    ← LANDING PRINCIPAL (HTML estructural)
├── ESTRUCTURA.md                 ← Este archivo
├── README.md                     ← (si existe)
├── .gitignore
│
├── css/                          ← TODO el CSS
│   ├── 01-base.css               ← Reset, container, secciones, tipografía, botones, header, cards, character, footer, responsive mobile original
│   ├── 02-overrides.css          ← Override v3: fondo global fijo, secciones transparentes, header unificado, efectos cards (hover/float), highlights de palabras clave
│   ├── 03-fluid-responsive.css   ← Escala fluida desktop 1024-1920px + media queries responsive tablets/celulares
│   └── 04-modal-comments.css     ← Estilos del modal "Compartir tu experiencia"
│
├── js/                           ← TODO el JS
│   ├── 01-fast-return-early.js   ← Script EARLY: oculta body y neutraliza Lenis si venimos de subpágina (carga al inicio del body)
│   ├── 02-engine.js              ← Motor: intro, header auto-hide, header adaptativo, Lenis init, hero pin (burbujas reveal), storytelling secciones
│   ├── 03-character.js           ← Personaje flotante: anchor, mouse follow, costume swap, drag & throw
│   ├── 04-h3-active-link.js      ← Animación de los h3 en Presentación + iluminado del link activo del header al scrollear
│   ├── 05-faq.js                 ← Acordeón de la sección FAQ
│   ├── 06-comments.js            ← Lógica del modal de comentarios (con Firebase o fallback localStorage)
│   ├── 07-fast-return-late.js    ← Script LATE: posiciona el scroll instantáneo al volver de subpágina (carga al final del body)
│   └── hero-mundo-transition.js  ← (Legacy, no usado actualmente — se puede eliminar)
│
├── paginas/                      ← SUBPÁGINAS agrupadas por tema
│   ├── cuentos/
│   │   ├── biblioteca.html       ← Pantalla intermedia: elegir Cuentos o Música
│   │   ├── cuentos.html          ← Grid con los 6 cuentos
│   │   ├── cuento-bano-magico.html
│   │   ├── cuento-sonrisa-magica.html
│   │   ├── cuento-respeto-y-amor.html
│   │   ├── cuento-oveja-negra.html
│   │   ├── cuento-frasco-brillante.html
│   │   └── cuento-gran-misterio-bano.html
│   └── juegos/
│       ├── juegos-descargables.html  ← Pantalla intermedia: elegir Juegos o Descargables
│       └── juego.html                 ← El juego HTML5
│
├── backups/                      ← Versiones viejas (no usar en producción)
│
├── assets en raíz (imágenes y videos)
│   ├── favicon.png
│   ├── personajeflotante.png     ← Sprite del personaje (default)
│   ├── disfrazverano.png         ← Costume verano
│   ├── disfrazpileta.png         ← Costume pileta
│   ├── arriba.png / abajo.png / izquierda.png / derecha.png  ← Sprites direccionales (drag)
│   ├── fondo.mp4                 ← Video del bosque (fondo global)
│   ├── intro.mp4                 ← (no usado actualmente)
│   ├── alicia-presentacion.png   ← Foto en la sección Presentación
│   └── alicia-aula.jpeg, alicia-libros.jpg, alicia.png, logo*.png, hero-personaje.png (backups/alternativas)
│
└── landing-david/                ← Proyecto React aparte (no afecta la web actual)
```

---

## 🎯 ¿Dónde modifico cada cosa?

### Textos y contenido de las secciones de la landing
**Archivo: `index.html`**

Las secciones están comentadas con banners. Buscá con Ctrl+F:

| Quiero cambiar... | Buscá... |
|---|---|
| Texto del hero (título grande, subtítulo, botones, burbujas) | `data-pos="center"` |
| Sección "Padres" (4 cards Imaginación/Conexión/Valores/Bienestar) | `id="padres"` |
| Sección "Qué es Alimeythor" (3 cards) | `id="que-es"` |
| Sección "Emociones vs Pantallas" (4 frases) | `id="emociones"` |
| Sección "Presentación" (foto Alicia + relato) | `id="presentacion"` |
| Sección FAQ (acordeón) | `id="faq"` |
| Sección "Comunidad" (3 cards + botón Compartir) | `id="comunidad"` |
| Botón "Compartir tu experiencia" + modal | Buscar `com-modal` o `com-open` |
| Pestañas del header (nav) | `nav-desktop` |
| Footer | `site-footer` |
| Firebase Config (credenciales) | `FIREBASE_CONFIG` |

### Colores, tipografías, tamaños, espaciados (CSS)
**Archivos: `css/*.css`**

| Quiero cambiar... | Archivo |
|---|---|
| Reset base, container, secciones generales, tipografía base (h1-h4, p), botones base, header base, cards base, footer base, character (sprite) | `css/01-base.css` |
| Color del fondo global del bosque desactivado, secciones transparentes, normalización de colores en navy/final, header siempre igual, efectos de hover/flotado de cards, highlight de palabras clave (`.hl`) | `css/02-overrides.css` |
| Escala fluida en monitores entre 1024-1920px, breakpoints tablet/celular | `css/03-fluid-responsive.css` |
| Modal "Compartir tu experiencia" (form, estrellas, lista de comentarios, responsive del modal) | `css/04-modal-comments.css` |

### Animaciones y comportamiento (JS)
**Archivos: `js/*.js`**

| Quiero cambiar... | Archivo |
|---|---|
| Cómo aparece el personaje, cómo se posiciona en cada sección | `js/03-character.js` |
| Cómo cambia de disfraz (costume swap) | `js/03-character.js` (sección COSTUME SWAP) |
| Drag & throw del personaje | `js/03-character.js` (sección Drag & throw) |
| Mouse follow del personaje | `js/03-character.js` (sección Mouse follow) |
| Pin del hero, revelado de burbujas en el primer scroll | `js/02-engine.js` (sección STORY STACK) |
| Animación "secciones dormidas que despiertan" | `js/02-engine.js` (sección STORYTELLING) |
| Header auto-hide al scrollear | `js/02-engine.js` (sección HEADER AUTO-HIDE) |
| Iluminado de la pestaña activa | `js/04-h3-active-link.js` |
| Animación de los h3 en la sección Presentación | `js/04-h3-active-link.js` |
| Acordeón FAQ | `js/05-faq.js` |
| Modal de comentarios + Firebase | `js/06-comments.js` |
| Retorno desde subpáginas a la sección de origen | `js/01-fast-return-early.js` + `js/07-fast-return-late.js` |

### Subpáginas (cuentos, juegos)
**Carpeta: `paginas/`**

| Quiero... | Archivo |
|---|---|
| Cambiar texto/foto de un cuento | `paginas/cuentos/cuento-*.html` |
| Cambiar el grid de cuentos (orden, títulos visibles) | `paginas/cuentos/cuentos.html` |
| Cambiar la pantalla "Cuentos o Música" | `paginas/cuentos/biblioteca.html` |
| Cambiar la pantalla "Juegos o Descargables" | `paginas/juegos/juegos-descargables.html` |
| Modificar el juego | `paginas/juegos/juego.html` |
| Agregar un cuento nuevo | 1) Copiar uno existente y modificarlo<br>2) Agregar entrada en `paginas/cuentos/cuentos.html` |

---

## ⚙️ Tareas frecuentes paso a paso

### Cambiar el texto del título del hero
1. Abrir `index.html`
2. Ctrl+F: `data-pos="center"`
3. Modificar el contenido del `<h1>` debajo
4. Guardar

### Cambiar el color rojo de marca a otro
1. Abrir `css/01-base.css`
2. Ctrl+F: `#E63946`
3. Reemplazar todas las ocurrencias en ese archivo
4. Hacer lo mismo en `css/02-overrides.css`, `css/03-fluid-responsive.css`, `css/04-modal-comments.css`
5. Hacer lo mismo en cada `paginas/**/*.html`
6. Guardar todos

### Conectar Firebase real para los comentarios
1. Crear proyecto en https://console.firebase.google.com
2. Agregar Web App → copiar el objeto `firebaseConfig`
3. Activar Firestore Database (modo test)
4. Abrir `index.html`
5. Ctrl+F: `FIREBASE_CONFIG`
6. Reemplazar cada `"PEGAR_AQUI"` por el valor real
7. Guardar

### Cambiar un texto de la subpágina "Cuentos"
1. Abrir `paginas/cuentos/cuentos.html`
2. Modificar el `<h1>`, los títulos, etc.

### Cambiar una pestaña del menú del header
1. Abrir `index.html`
2. Ctrl+F: `nav-desktop`
3. Modificar los `<a href="#...">`

---

## 🚀 Deploy

El proyecto está conectado a GitHub: https://github.com/Santichaparro97/Alimeythro

Cualquier `git push` a la rama `main` re-despliega automáticamente en Vercel (si está conectado).

```bash
cd "C:/Users/usuario/Contacts/mundo-alimeythor"
git add .
git commit -m "Descripción del cambio"
git push
```

---

## ⚠️ Reglas internas

- **El JS del motor (engine, character, faq, comments, return-flow) se puede modificar pero con cuidado**. Los efectos de hero pin, storytelling y personaje están todos interconectados.
- **Los archivos en `/css/` y `/js/` se cargan en orden** según los `<link>` y `<script>` en `index.html`. Si agregás CSS nuevo, considerá si va antes o después de los overrides (los overrides están en `02-overrides.css`, lo que cargás después puede sobreescribirlos).
- **Las subpáginas referencian assets con `../../`** (porque están dentro de `paginas/<tema>/`). Si movés un asset, hay que actualizar todas las rutas.
- **Para volver a la landing desde una subpágina** usan `sessionStorage.setItem('alm_return', 'que-es')` antes de navegar a `../../index.html`. Esto activa el "fast return" que posiciona el scroll directamente en la sección de origen.
