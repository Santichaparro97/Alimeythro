# 🎵 Carpeta de audio — Mundo Alimeythor

Subí acá los 9 MP3s con **estos nombres exactos** para que el reproductor los encuentre:

| # | Filename esperado | Canción |
|---|---|---|
| 1 | `01-secreto-estelar.mp3` | Secreto Estelar |
| 2 | `02-donde-esta-la-magia.mp3` | Dónde está la magia |
| 3 | `03-siempre-me-vas-a-tener.mp3` | Siempre me vas a tener |
| 4 | `04-parte-del-escuadron.mp3` | Parte del escuadrón |
| 5 | `05-guardo-mis-palabras.mp3` | Guardo mis palabras |
| 6 | `06-escuchamos-juntos.mp3` | Escuchamos juntos |
| 7 | `07-ensename-a-escuchar.mp3` | Enseñame a escuchar |
| 8 | `08-malvavisco-magico.mp3` | Malvavisco mágico, eres así |
| 9 | `09-despertar-al-mundo.mp3` | Despertar al mundo |

## Cómo convertir tus archivos MP4 a MP3

1. Andá a https://cloudconvert.com/mp4-to-mp3 (gratis, sin registro)
2. Subí los 9 videos MP4 que tenías en Drive (`Subir`)
3. Configurá la conversión a `MP3` con bitrate **192kbps** o **256kbps** (suficiente para canciones)
4. Convertí y descargá los MP3s (van a pesar ~5-8MB cada uno)
5. Renombrá cada MP3 con el nombre exacto de la tabla de arriba
6. Subilos a esta carpeta (`audio/`) en el repo:
   - Opción A (web): GitHub → tu repo → carpeta `audio/` → botón **"Add file → Upload files"** → arrastrá los 9 → Commit
   - Opción B (local): pegalos en `C:\Users\usuario\Contacts\mundo-alimeythor\audio\` y ejecutá `git add audio/ && git commit -m "Audio MP3" && git push`

## Verificar que funciona

Abrí la web → Cuentos y música → Música → dale play a una canción. Deberían cargar inmediatamente (sin pantalla de "Cargando…" más allá de un segundo).

## Notas

- Los nombres son sensibles a mayúsculas/minúsculas y al guión: respetá el formato exacto.
- Si querés cambiar el orden o título, edita `paginas/musica/musica.html` en el array `SONGS`.
- El reproductor también guarda automáticamente cuáles escuchaste (✅) y cuáles marcaste como favoritas (❤️) en localStorage.
