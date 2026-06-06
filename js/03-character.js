    /* ============================================================
       SISTEMA DE PERSONAJE FLOTANTE — config-driven por atributos
       ============================================================
       Cada <section> declara su propio anchor:
         data-char-side    = "left" | "right"
         data-char-gap     = px (separación al texto o al borde)
         data-char-against = "text" | "edge"

       Layout de capas:
         .floating-character    → SCROLL position (x, y entre secciones)
         .floating-character__bob → IDLE floating (yPercent yoyo)
         .floating-character__img → MOUSE follow + DRAG (rotación, micro x/y)

       No hay conflictos de transforms porque cada propiedad vive en
       un elemento distinto.
    ============================================================ */
    (function () {
      const el  = document.querySelector('[data-floating-character]');
      const bob = el && el.querySelector('.floating-character__bob');
      if (!el || !bob) return;

      const RIGHT_ANCHOR = 30; // CSS: .floating-character { right: 30px }

      // Mide los bordes REALES del texto rendereado dentro del .text-block,
      // usando Range API (que da el ancho del texto visible, no del contenedor).
      // Esto hace que la posición del personaje sea consistente en cualquier
      // tamaño de pantalla — siempre relativa al texto, nunca al viewport.
      const TEXT_NODES_SELECTOR = 'h1, h2, h3, h4, p, .eyebrow, .btn, .tag';
      function getTextEdges(textBlock) {
        if (!textBlock) return null;
        let minLeft = Infinity, maxRight = -Infinity;
        textBlock.querySelectorAll(TEXT_NODES_SELECTOR).forEach((node) => {
          if (!node.textContent.trim()) return;
          try {
            const range = document.createRange();
            range.selectNodeContents(node);
            const r = range.getBoundingClientRect();
            if (!r.width) return;
            if (r.left  < minLeft)  minLeft  = r.left;
            if (r.right > maxRight) maxRight = r.right;
          } catch (e) {}
        });
        if (minLeft === Infinity) {
          const r = textBlock.getBoundingClientRect();
          return { left: r.left, right: r.right };
        }
        return { left: minLeft, right: maxRight };
      }

      // Calcula el xPercent target: personaje a `gap` px del borde del TEXTO,
      // del lado declarado por data-char-side. Sin dependencia del viewport.
      function anchorXPercent(section) {
        const side = section.dataset.charSide   || 'right';
        const gap  = parseInt(section.dataset.charGap || '5', 10);

        const vw  = window.innerWidth;
        const elW = el.offsetWidth || 320;
        const currentLeft = vw - RIGHT_ANCHOR - elW;

        const textBlock = section.querySelector('.text-block');
        const edges     = getTextEdges(textBlock);

        let targetLeft;
        if (edges) {
          targetLeft = side === 'left'
            ? edges.left  - gap - elW
            : edges.right + gap;
        } else {
          // Fallback: borde del viewport
          targetLeft = side === 'left' ? gap : vw - gap - elW;
        }

        const xp = ((targetLeft - currentLeft) / elW) * 100;
        console.log(`📍 ${section.id || section.className.split(' ')[1]} | side=${side} gap=${gap} | textEdges=[${edges ? Math.round(edges.left)+','+Math.round(edges.right) : '—'}] → targetLeft=${Math.round(targetLeft)}px xPercent=${xp.toFixed(1)}%`);
        return xp;
      }

      // Alineación vertical: centro del personaje = centro del bloque de texto.
      function anchorYOffset(section) {
        const textBlock = section.querySelector('.text-block');
        if (!textBlock) return 0;
        const secRect = section.getBoundingClientRect();
        const txtRect = textBlock.getBoundingClientRect();
        const txtCenterFromSecTop = (txtRect.top - secRect.top) + txtRect.height / 2;
        return txtCenterFromSecTop - secRect.height / 2;
      }

      function start() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        const isMobile = window.matchMedia('(max-width: 960px)').matches;

        const sections = Array.from(document.querySelectorAll('.section[data-char-side]'));
        if (!sections.length) return;

        // Baseline del transform (matches CSS top:50%)
        gsap.set(el, { xPercent: 0, yPercent: -50, force3D: true });

        // ===== Idle floating constante sobre .bob =====
        // Bobbing sutil que NO compite con scroll (que vive en el wrapper)
        // ni con mouse follow (que vive en el img).
        gsap.to(bob, {
          y: '+=12',
          duration: 2.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });

        // Personaje ANCLADO al lateral derecho (CSS: right: 30px; top: 50%).
        // Ya no se mueve automáticamente con el scroll — solo el usuario
        // puede moverlo arrastrándolo (sistema de drag & throw más abajo).
        // Mantenemos activos: idle floating, mouse follow (cabeza/ojos),
        // y drag & throw. Cuando soltás después de arrastrar, vuelve a su
        // posición fija al hacer scroll.

        ScrollTrigger.refresh();
      }

      if (document.readyState === 'complete') start();
      else window.addEventListener('load', start, { once: true });
    })();

    /* ===== Mouse follow sobre AMBAS capas de img (a y b) =====
       Tiene que aplicar a las dos porque el costume swap intercambia
       cuál capa está visible. Si solo animáramos una, después del
       primer swap el sprite visible quedaría sin movimiento de cabeza.
    */
    (function () {
      const wrap = document.querySelector('[data-floating-character]');
      const imgs = wrap && wrap.querySelectorAll('.floating-character__img');
      if (!wrap || !imgs || !imgs.length) return;

      const MAX = { rotation: 6, x: 10, y: 8 };
      gsap.set(imgs, { transformOrigin: '50% 30%', force3D: true });
      const setRot = gsap.quickTo(imgs, 'rotation', { duration: 0.6, ease: 'power3.out' });
      const setX   = gsap.quickTo(imgs, 'x',        { duration: 0.5, ease: 'power3.out' });
      const setY   = gsap.quickTo(imgs, 'y',        { duration: 0.5, ease: 'power3.out' });

      let nx = 0, ny = 0, rafId = 0;
      window.addEventListener('mousemove', (e) => {
        nx = Math.max(-1, Math.min(1, (e.clientX - innerWidth/2) / (innerWidth/2)));
        ny = Math.max(-1, Math.min(1, (e.clientY - innerHeight/2) / (innerHeight/2)));
        if (!rafId) rafId = requestAnimationFrame(() => {
          rafId = 0;
          const easeFn = v => Math.sign(v) * Math.pow(Math.abs(v), 0.8);
          setRot(easeFn(nx) * MAX.rotation);
          setX(easeFn(nx) * MAX.x);
          setY(easeFn(ny) * MAX.y);
        });
      }, { passive: true });

      document.addEventListener('mouseleave', () => { setRot(0); setX(0); setY(0); });
    })();

    /* ============================================================
       COSTUME SWAP — el personaje cambia de disfraz al entrar a
       secciones marcadas con data-char-costume="verano|pileta".
       Si la sección no declara disfraz, vuelve al sprite default.
       ============================================================ */
    (function () {
      const wrap = document.querySelector('[data-floating-character]');
      const imgs = wrap && wrap.querySelectorAll('.floating-character__img');
      if (!wrap || !imgs || imgs.length < 2) return;

      const V = 'v2';
      const COSTUMES = {
        default: './personajeflotante.png',
        verano:  './disfrazverano.png?' + V,
        pileta:  './disfrazpileta.png?' + V
      };

      // Preload para que el swap sea instantáneo
      Object.values(COSTUMES).forEach((src) => { const i = new Image(); i.src = src; });

      // Dos capas: active = visible, ghost = oculta. Se intercambian en cada swap.
      let active = imgs[0];   // .floating-character__img
      let ghost  = imgs[1];   // .floating-character__img--ghost
      let currentCostume = 'default';

      function swapTo(costume) {
        if (costume === currentCostume) return;
        const src = COSTUMES[costume] || COSTUMES.default;
        currentCostume = costume;

        // Cargar el nuevo sprite en la capa ghost ANTES de revelarla
        const onReady = () => {
          // Crossfade instantáneo (no hay gap blanco)
          ghost.classList.remove('floating-character__img--ghost');
          active.classList.add('floating-character__img--ghost');
          const tmp = active; active = ghost; ghost = tmp;
        };

        if (ghost.src.endsWith(src) && ghost.complete) {
          onReady();
        } else {
          ghost.onload = onReady;
          ghost.src = src;
          // Failsafe: si ya está cacheada y onload no dispara
          if (ghost.complete) requestAnimationFrame(onReady);
        }
      }

      // ============================================================
      // Detección PRECISA: qué sección contiene el centro del personaje.
      // Trigger exacto cuando el borde de la sección cruza el centro
      // del sprite — no por threshold de IntersectionObserver.
      // ============================================================
      const sections = Array.from(document.querySelectorAll('.section[data-char-costume], .section, .story-stack'));
      if (!sections.length) return;

      let scheduled = false;
      function check() {
        scheduled = false;
        const wrapRect = wrap.getBoundingClientRect();
        const charCenterY = wrapRect.top + wrapRect.height / 2;
        let containing = null;
        for (const s of sections) {
          const r = s.getBoundingClientRect();
          if (r.top <= charCenterY && r.bottom > charCenterY) {
            containing = s;
            break;
          }
        }
        if (!containing) return;
        const costume = containing.dataset.charCostume || 'default';
        swapTo(costume);
      }
      function onScroll() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(check);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      check();
    })();

    /* ===== Drag & throw =====
       Listener de pointerdown enganchado a AMBAS capas — el costume
       swap intercambia cuál es la activa, así que si solo escuchamos
       en la original, después del primer swap no se puede agarrar.
    */
    (function () {
      const wrap = document.querySelector('[data-floating-character]');
      const imgs = wrap && wrap.querySelectorAll('.floating-character__img');
      if (!wrap || !imgs || !imgs.length) return;
      const img = imgs[0]; // referencia "principal" para src swap direccional

      // Constantes geométricas: margen al borde y assets direccionales
      const EDGE = 30;
      const SRC = {
        derecha:   './derecha.png',
        izquierda: './izquierda.png',
        arriba:    './arriba.png',
        abajo:     './abajo.png',
        default:   './personajeflotante.png'
      };

      // Preloading de las 4 imágenes direccionales para evitar flash al cambiar src
      Object.values(SRC).forEach((src) => { const i = new Image(); i.src = src; });

      const setX   = gsap.quickSetter(wrap, 'x', 'px');
      const setY   = gsap.quickSetter(wrap, 'y', 'px');
      const setRot = gsap.quickSetter(wrap, 'rotation', 'deg');

      let dragging = false, startMX=0, startMY=0, baseX=0, baseY=0;
      let curX=0, curY=0, lastX=0, lastY=0, velX=0, velY=0;

      const onPointerDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true;
        wrap.classList.add('is-dragging');
        const target = e.currentTarget;
        target.setPointerCapture && target.setPointerCapture(e.pointerId);
        activePointerTarget = target;
        baseX = gsap.getProperty(wrap, 'x');
        baseY = gsap.getProperty(wrap, 'y');
        curX = lastX = baseX; curY = lastY = baseY; velX = velY = 0;
        startMX = e.clientX; startMY = e.clientY;
        gsap.killTweensOf(wrap, 'x,y,rotation');
        e.preventDefault();
      };
      let activePointerTarget = null;
      imgs.forEach((i) => i.addEventListener('pointerdown', onPointerDown));

      window.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startMX, dy = e.clientY - startMY;
        lastX = curX; lastY = curY;
        curX = baseX + dx; curY = baseY + dy;
        velX = curX - lastX; velY = curY - lastY;
        setX(curX); setY(curY);
        setRot(Math.max(-22, Math.min(22, velX * 0.55)));
      });

      // Determina el cuadrante donde quedó y devuelve el target + imagen.
      // Eje dominante (cuál distancia desde el centro es mayor) define la dirección.
      function resolveSnap() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const elW = wrap.offsetWidth  || 320;
        const elH = wrap.offsetHeight || 480;

        // Baseline = posición top-left cuando x=0, y=0 (CSS: right:30, top:50% + translateY(-50%))
        const baselineLeft = vw - EDGE - elW;
        const baselineTop  = vh / 2 - elH / 2;

        // Centro actual del personaje (después del drag)
        const cx = baselineLeft + curX + elW / 2;
        const cy = baselineTop  + curY + elH / 2;

        const isLeft = cx < vw / 2;
        const isTop  = cy < vh / 2;
        const dx = cx - vw / 2;
        const dy = cy - vh / 2;
        const horizontalDominant = Math.abs(dx) > Math.abs(dy);

        // Imagen apuntando al CENTRO
        let src;
        if (horizontalDominant) {
          src = isLeft ? SRC.derecha : SRC.izquierda;
        } else {
          src = isTop  ? SRC.abajo   : SRC.arriba;
        }

        // Esquina target (top-left coords)
        const targetLeft = isLeft ? EDGE : (vw - EDGE - elW);
        const targetTop  = isTop  ? EDGE : (vh - EDGE - elH);

        return {
          src,
          targetX: targetLeft - baselineLeft,
          targetY: targetTop  - baselineTop
        };
      }

      function release(e) {
        if (!dragging) return;
        dragging = false;
        wrap.classList.remove('is-dragging');
        const t = activePointerTarget || img;
        try { t.releasePointerCapture && t.releasePointerCapture(e.pointerId); } catch (err) {}
        activePointerTarget = null;

        const snap = resolveSnap();
        // Swap direccional aplicado a AMBAS capas para que la visible
        // siempre tenga la dirección correcta tras el throw.
        imgs.forEach((i) => { i.src = snap.src; });

        // Animación de imantación a la esquina del cuadrante
        gsap.to(wrap, {
          x: snap.targetX,
          y: snap.targetY,
          rotation: 0,
          duration: 0.7,
          ease: 'power3.out'
        });
      }
      window.addEventListener('pointerup',     release);
      window.addEventListener('pointercancel', release);
    })();
