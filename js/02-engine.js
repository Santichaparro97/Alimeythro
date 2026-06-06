    /* ============================================================
       INTRO — sincronizada y reseteable
       Cada recarga: scroll al top, video de fondo desde 0,
       personaje aparece 1s después de que el video arranca.
       ============================================================ */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    window.addEventListener('load', () => {
      window.scrollTo(0, 0);

      const sticky    = document.querySelector('.story-stack__sticky');
      const character = document.querySelector('[data-floating-character]');
      const bgVideo   = document.querySelector('.story-stack__bg');

      // Reset visual al estado inicial
      if (sticky)    sticky.classList.remove('is-lit');
      if (character) character.classList.remove('is-ready');

      function startTimer() {
        setTimeout(() => {
          if (sticky)    sticky.classList.add('is-lit');
          if (character) character.classList.add('is-ready');
        }, 1000);
      }

      if (bgVideo) {
        try { bgVideo.currentTime = 0; } catch (e) {}
        const begin = () => startTimer();
        // Esperar a que el video efectivamente arranque para sincronizar el 1s
        if (!bgVideo.paused && bgVideo.currentTime > 0) begin();
        else bgVideo.addEventListener('playing', begin, { once: true });
        const p = bgVideo.play();
        if (p && typeof p.catch === 'function') p.catch(() => startTimer());
        // Failsafe: si el video no arranca en 1.5s, igual mostrar el personaje
        setTimeout(() => { if (bgVideo.paused) startTimer(); }, 1500);
      } else {
        startTimer();
      }
    });

    /* ============================================================
       HEADER AUTO-HIDE — se oculta al scrollear hacia abajo,
       reaparece al scrollear hacia arriba o al acercar el mouse al tope.
       ============================================================ */
    (function () {
      const header = document.querySelector('.site-header');
      if (!header) return;

      let lastY = window.scrollY;
      const DELTA = 6;     // umbral mínimo de scroll para reaccionar
      const TOP_ZONE = 80; // px desde el tope donde el mouse muestra el header

      function update() {
        const y = window.scrollY;
        const diff = y - lastY;
        if (Math.abs(diff) < DELTA) return;
        if (y < 60) {
          header.classList.remove('is-hidden');
        } else if (diff > 0) {
          header.classList.add('is-hidden');     // scroll down
        } else {
          header.classList.remove('is-hidden');  // scroll up
        }
        lastY = y;
      }

      let scheduled = false;
      window.addEventListener('scroll', () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => { scheduled = false; update(); });
      }, { passive: true });

      // Mouse cerca del tope → revelar
      window.addEventListener('mousemove', (e) => {
        if (e.clientY <= TOP_ZONE) header.classList.remove('is-hidden');
      }, { passive: true });
    })();

    /* ============================================================
       HEADER ADAPTATIVO — copia el color de la sección bajo el header
       ============================================================ */
    (function () {
      const header = document.querySelector('.site-header');
      if (!header) return;
      const headerH = header.offsetHeight || 70;

      function themeFor(section) {
        if (!section) return 'white';
        if (section.classList.contains('story-stack')) return 'video';
        if (section.classList.contains('section--cream')) return 'cream';
        if (section.classList.contains('section--navy'))  return 'navy';
        if (section.classList.contains('section--final')) return 'pink';
        return 'white';
      }

      const sections = Array.from(document.querySelectorAll('.story-stack, .section'));
      let current = null;

      function update() {
        const probeY = headerH + 4; // un poco bajo el borde del header
        let hit = null;
        for (const s of sections) {
          const r = s.getBoundingClientRect();
          if (r.top <= probeY && r.bottom > probeY) { hit = s; break; }
        }
        const theme = themeFor(hit);
        if (theme !== current) {
          current = theme;
          header.setAttribute('data-theme', theme);
        }
      }

      let scheduled = false;
      function onScroll() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => { scheduled = false; update(); });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
    })();

    /* ===== Lenis smooth scroll integrado con ScrollTrigger ===== */
    let lenis = null;
    try {
      gsap.registerPlugin(ScrollTrigger);
      if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
          duration: 1.2,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          smoothTouch: false
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(t => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
        // Forzar arranque en 0 sin la animación inicial de Lenis
        lenis.scrollTo(0, { immediate: true, force: true });
      }
    } catch (e) { console.warn('Lenis fail:', e); }

    /* ============================================================
       STORY STACK — paneles que caen secuencialmente durante el pin
       ============================================================
       El .story-stack mide 300vh. Su contenido (.story-stack__sticky)
       queda pineado al top mientras se hace scroll por sus 300vh.
       Cada panel cae desde arriba en su tercio correspondiente del scroll.
    */
    (function () {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      const isMobile = window.matchMedia('(max-width: 960px)').matches;
      if (isMobile) return; // mobile: layout simple en flujo normal, sin pin

      const stack = document.querySelector('.story-stack');
      if (!stack) return;

      // Hero ya visible. Las burbujas arrancan ocultas hasta el primer scroll.
      const burbujas = document.querySelectorAll('#hero-burbujas .hero-burbuja');
      if (burbujas.length) gsap.set(burbujas, { opacity: 0, y: 20 });

      let revealed = false;

      function revealBurbujas() {
        if (revealed) return false;
        revealed = true;
        if (burbujas.length) {
          gsap.to(burbujas, {
            opacity: 1, y: 0,
            duration: 0.6, stagger: 0.12, ease: 'back.out(1.7)'
          });
        }
        unlock();
        return true;
      }

      // Bloqueo del scroll hasta que las burbujas se revelen (un solo gesto basta)
      function lockKeys(e) {
        if (revealed) return;
        const keys = [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
        if (keys.includes(e.key)) { e.preventDefault(); revealBurbujas(); }
      }
      function lockWheel(e) {
        if (revealed) return;
        e.preventDefault();
        revealBurbujas();
      }
      let touchStartY = 0;
      function onTouchStart(e) { touchStartY = e.touches[0].clientY; }
      function lockTouch(e) {
        if (revealed) return;
        e.preventDefault();
        const dy = touchStartY - e.touches[0].clientY;
        if (Math.abs(dy) > 8) revealBurbujas();
      }

      window.addEventListener('wheel',      lockWheel, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove',  lockTouch, { passive: false });
      window.addEventListener('keydown',    lockKeys);

      // Lenis: pausar mientras el lock está activo, reanudar al terminar
      if (window.lenis && typeof window.lenis.stop === 'function') window.lenis.stop();
      else if (typeof lenis !== 'undefined' && lenis && lenis.stop) lenis.stop();

      function unlock() {
        window.removeEventListener('wheel',      lockWheel);
        window.removeEventListener('touchmove',  lockTouch);
        window.removeEventListener('keydown',    lockKeys);
        try { (window.lenis || lenis).start(); } catch (e) {}
      }

      ScrollTrigger.refresh();
    })();

    /* ============================================================
       STORYTELLING — Sistema "secciones dormidas" bidireccional
       ============================================================
       Cada sección arranca dormida (grayscale + blur + opacity baja).
       Al entrar al viewport (top 80%) → la sección se "enciende"
       progresivamente con scrub: textos aparecen escalonados, el glow
       de fondo se intensifica, los colores se saturan.
       Al scrollear hacia arriba → la sección se "duerme" de vuelta
       (el mismo proceso pero en reversa).
       En mobile (≤960px) → todo el sistema se omite, sección siempre activa.
    */
    (function () {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      const isMobile = window.matchMedia('(max-width: 960px)').matches;
      if (isMobile) return; // mobile: todo activo siempre, sin filtros

      const sections = Array.from(document.querySelectorAll('.section'));
      if (!sections.length) return;

      sections.forEach((section) => {
        // Detectar elementos clave dentro de la sección para el reveal escalonado.
        const heading     = section.querySelector('h1, h2');
        const eyebrow     = section.querySelector('.eyebrow');
        const divider     = section.querySelector('.divider');
        const paragraphs  = section.querySelectorAll('.text-block p');
        const tags        = section.querySelector('.tag-list');
        const buttons     = section.querySelectorAll('.btn-group, .pase-card .btn');
        const cards       = section.querySelectorAll('.card, .testimonial, .pase-card');

        // Timeline scrubbeada bidireccional. Trigger RETRASADO: la sección
        // empieza a revelarse cuando su top llega al 55% del viewport
        // (suficientemente arriba para que el personaje ya esté en su
        // anchor lateral). Termina al 5% (sección casi al tope).
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', duration: 1 },
          scrollTrigger: {
            trigger: section,
            start:   'top 55%',
            end:     'top 5%',
            scrub:   1.2,
            invalidateOnRefresh: true
          }
        });

        // === FASE 1 (timeline 0.0 – 1.0): el personaje llega ===
        // Solo se despierta el fondo: grayscale → color, glow se enciende.
        // El CONTENIDO sigue invisible. Esto le da tiempo al personaje
        // a posicionarse en su anchor antes de que aparezca cualquier texto.
        tl.fromTo(section,
          { filter: 'grayscale(1) blur(4px)', opacity: 0.4, '--glow': 0 },
          { filter: 'grayscale(0) blur(0px)', opacity: 1,   '--glow': 1, duration: 1.0 },
          0
        );

        // === FASE 2 (timeline 1.0 +): rompecabezas, piezas snap into place ===
        // Cada elemento entra desde una dirección distinta con back.out,
        // dando sensación de piezas que encajan en su lugar.

        // Eyebrow → entra desde la IZQUIERDA, rotando
        if (eyebrow) {
          tl.fromTo(eyebrow,
            { opacity: 0, x: -50, rotation: -8 },
            { opacity: 1, x: 0, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' },
            1.0
          );
        }

        // Título → escala desde 0.6 con leve rotación (efecto "aparece de la nada")
        if (heading) {
          tl.fromTo(heading,
            { opacity: 0, scale: 0.6, rotation: -3, transformOrigin: '50% 100%' },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.6)' },
            1.15
          );
        }

        // Divider → escala horizontal desde el centro
        if (divider) {
          tl.fromTo(divider,
            { scaleX: 0, transformOrigin: '50% 50%', opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
            1.35
          );
        }

        // Tags → cada una desde un ángulo distinto, con rebote
        if (tags) {
          tl.fromTo(tags.children,
            { opacity: 0, scale: 0, rotation: -25, transformOrigin: '50% 100%' },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.55, stagger: 0.1, ease: 'back.out(2)' },
            1.45
          );
        }

        // Párrafos → entran desde abajo, escalonados
        if (paragraphs.length) {
          tl.fromTo(paragraphs,
            { opacity: 0, y: 35, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
            1.55
          );
        }

        // Botones → pop con rebote pronunciado
        if (buttons.length) {
          tl.fromTo(buttons,
            { opacity: 0, scale: 0, rotation: 15 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(2.2)' },
            1.75
          );
        }

        // Cards → ALTERNAN dirección (zig-zag puzzle): par desde izq, impar desde der.
        if (cards.length) {
          cards.forEach((card, i) => {
            const fromX = i % 2 === 0 ? -60 : 60;
            tl.fromTo(card,
              { opacity: 0, x: fromX, y: 30, rotation: i % 2 === 0 ? -4 : 4, scale: 0.9 },
              { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
              1.6 + i * 0.12
            );
          });
        }
      });

      ScrollTrigger.refresh();
    })();

