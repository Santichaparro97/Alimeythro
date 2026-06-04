/* =====================================================================
   PASO 2 — Hero → Mundo: animación scroll-driven con GSAP + ScrollTrigger
   Asume que GSAP, ScrollTrigger y Lenis ya están cargados (lo hace el
   bloque <script> del propio index-v2.html con CDNs).
   ===================================================================== */
(function () {
  'use strict';

  // ---- Guardas tempranas -------------------------------------------------
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const pin    = document.getElementById('hero-mundo-pin');
  const stage  = pin && pin.querySelector('.pin-stage');
  const warm   = pin && pin.querySelector('.warm-layer');
  const night  = pin && pin.querySelector('.night-layer');
  if (!pin || !stage || !warm || !night) return;

  const charStage   = night.querySelector('.character-stage');
  const charSolid   = night.querySelector('#character-solid');
  const charWire    = night.querySelector('#character-wireframe');
  const pedestal    = night.querySelector('.pedestal');
  const counter     = night.querySelector('.counter');
  const lightCone   = night.querySelector('.light-cone');
  // 4 destellos flotantes (Calma/Curiosidad/Empatía/Valentía)
  const DEST_KEYS = ['calma', 'curiosidad', 'empatia', 'valentia'];
  const destelloEls = DEST_KEYS.map(k => night.querySelector('.df-' +
    (k === 'calma' ? 'tl' : k === 'curiosidad' ? 'tr' :
     k === 'empatia' ? 'bl' : 'br')));
  const destelloLines = DEST_KEYS.map(k => night.querySelector('.line-' + k));
  const destelloDots  = DEST_KEYS.map(k => night.querySelector('.endpoint-' + k));

  // ---- Estado final estático (para reduced-motion y mobile) --------------
  function applyFinalStaticState() {
    gsap.set(warm, { yPercent: -100 });
    if (charStage) charStage.style.setProperty('--scan', '100%');
    if (counter) counter.textContent = '100';
    gsap.set([pedestal, counter, charSolid, charWire, lightCone,
              ...destelloEls.filter(Boolean)],
             { opacity: 1, y: 0, scale: 1 });
    destelloLines.forEach(p => {
      if (!p) return;
      p.style.strokeDasharray = 'none';
      p.style.strokeDashoffset = '0';
    });
  }

  // DEBUG: guards desactivados temporalmente. Re-activar antes de prod.
  console.log('[hero-mundo] viewport', window.innerWidth,
              'reducedMotion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { applyFinalStaticState(); return; }
  // if (window.innerWidth < 1024) { applyFinalStaticState(); return; }

  // ---- Lenis: ya está inicializado en index-v2.html y enchufado a
  //      ScrollTrigger.update. No re-inicializamos para evitar conflicto.
  //      Si por alguna razón no estuviera, ScrollTrigger igual funciona con
  //      scroll nativo del navegador.

  // ---- Líneas SVG dinámicas: recalculadas según posiciones reales -------
  const svgEl = night.querySelector('#connection-lines');

  function setPath(path, x1, y1, x2, y2) {
    if (!path) return;
    const dx = x2 - x1;
    const cx1 = x1 + dx * 0.5, cy1 = y1;
    const cx2 = x1 + dx * 0.5, cy2 = y2;
    path.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
  }
  function setDot(c, x, y) {
    if (!c) return;
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
  }

  function recomputeLines() {
    if (!svgEl) return;
    const nightRect = night.getBoundingClientRect();
    const W = nightRect.width, H = nightRect.height;
    svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);

    if (!charStage) return;
    const charRect = charStage.getBoundingClientRect();
    const charLeft = charRect.left - nightRect.left;
    const charTop  = charRect.top  - nightRect.top;
    const cW = charRect.width, cH = charRect.height;

    // 4 anclas en el personaje (cabeza-izq, cabeza-der, torso-izq, torso-der)
    const anchors = {
      calma:      { x: charLeft + cW * 0.30, y: charTop + cH * 0.18 }, // TL → cabeza-izq
      curiosidad: { x: charLeft + cW * 0.70, y: charTop + cH * 0.18 }, // TR → cabeza-der
      empatia:    { x: charLeft + cW * 0.30, y: charTop + cH * 0.55 }, // BL → torso-izq
      valentia:   { x: charLeft + cW * 0.70, y: charTop + cH * 0.55 }, // BR → torso-der
    };

    DEST_KEYS.forEach((key, i) => {
      const el = destelloEls[i];
      const line = destelloLines[i];
      const dot = destelloDots[i];
      if (!el || !line) return;
      const r = el.getBoundingClientRect();
      // Punto de salida del destello hacia el personaje
      const isLeft  = key === 'calma' || key === 'empatia';
      const x1 = (isLeft ? r.right : r.left) - nightRect.left;
      const y1 = r.top + r.height / 2 - nightRect.top;
      const a  = anchors[key];
      setPath(line, x1, y1, a.x, a.y);
      setDot(dot, a.x, a.y);
    });

    // Recalc dasharray + preservar % dibujado
    destelloLines.forEach(p => {
      if (!p) return;
      const prevLen    = parseFloat(p.style.strokeDasharray)  || 0;
      const prevOffset = parseFloat(p.style.strokeDashoffset) || 0;
      const drawnRatio = prevLen ? Math.max(0, Math.min(1, 1 - prevOffset / prevLen)) : 0;
      const newLen = p.getTotalLength();
      p.style.strokeDasharray  = newLen;
      p.style.strokeDashoffset = newLen * (1 - drawnRatio);
    });
  }
  recomputeLines();
  window.addEventListener('resize', () => {
    requestAnimationFrame(recomputeLines);
  });

  // ---- Estados iniciales -------------------------------------------------
  gsap.set(warm, { yPercent: 0 });
  gsap.set(pedestal,  { scale: 0, opacity: 0, y: 40, transformOrigin: '50% 100%' });
  gsap.set(counter,   { opacity: 0 });
  gsap.set(charSolid, { opacity: 0 });
  gsap.set(charWire,  { opacity: 0 });
  gsap.set(lightCone, { opacity: 0 });
  gsap.set(destelloEls.filter(Boolean), { opacity: 0, y: -10, scale: 0.9 });
  if (charStage) charStage.style.setProperty('--scan', '0%');
  if (counter)   counter.textContent = '000';

  // ---- Timeline atada a ScrollTrigger -----------------------------------
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: '+=200%',
      pin: stage,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        if (counter) {
          counter.textContent = Math.round(self.progress * 100)
            .toString()
            .padStart(3, '0');
        }
      }
    }
  });

  // Duración total = 1 unidad → las "positions" son las normalizadas del prompt.

  // FASE 0.00 → 0.40: warm-layer sube
  tl.to(warm, { yPercent: -100, ease: 'none', duration: 0.40 }, 0.00);

  // FASE 0.20 → 0.35: pedestal entra con back, counter aparece
  tl.to(pedestal,
        { scale: 1, opacity: 1, y: 0, ease: 'back.out(1.4)', duration: 0.15 },
        0.20);
  tl.to(counter, { opacity: 1, duration: 0.15 }, 0.20);

  // FASE 0.35 → 0.45: el personaje (ambas capas) aparece
  tl.to([charSolid, charWire], { opacity: 1, duration: 0.10 }, 0.35);

  // FASE 0.45 → 0.95: scan de pies a cabeza + light cone
  tl.to(charStage, { '--scan': '100%', ease: 'none', duration: 0.50 }, 0.45);
  tl.to(lightCone, { opacity: 0.7, duration: 0.10 }, 0.45);

  // FASES 0.50 → 0.92: los 4 destellos aparecen uno por uno mientras la
  // scan-line los va "descubriendo". Stagger ~0.10-0.12 entre cada uno.
  const destelloStartPositions = [0.50, 0.62, 0.74, 0.86]; // calma/curiosidad/empatia/valentia
  destelloEls.forEach((el, i) => {
    if (!el) return;
    const pos = destelloStartPositions[i];
    tl.to(el,
          { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.06 },
          pos);
    const line = destelloLines[i];
    if (line) {
      tl.to(line,
            { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.06 },
            pos);
    }
  });

  // Refresh ScrollTrigger cuando todo el DOM/Lenis esté listo
  window.addEventListener('load', () => {
    recomputeLines();
    ScrollTrigger.refresh();
  });
  ScrollTrigger.addEventListener('refresh', recomputeLines);

  /* ===================================================================
     PASO 3 — Polish final
     Sólo en desktop ≥1024px con hover fino y sin reduced-motion.
     =================================================================== */
  // DEBUG: guard de hover fino también desactivado por ahora.
  // const hasFineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // if (!hasFineHover) return;

  /* ---- 1) PARTÍCULAS DORADAS DURANTE EL SCAN -------------------------- */
  const PARTICLE_COUNT = 20;
  const pool = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    night.appendChild(el);
    pool.push({ el, busy: false });
  }

  function spawnParticle() {
    const slot = pool.find(p => !p.busy);
    if (!slot) return;
    slot.busy = true;
    const startX = gsap.utils.random(-110, 110);
    const driftX = startX + gsap.utils.random(-40, 40);
    gsap.fromTo(slot.el,
      { x: startX, y: 0, opacity: 0, scale: 0.5 },
      {
        x: driftX,
        y: -500,
        opacity: 1,
        scale: 1,
        duration: 2.5,
        ease: 'power1.out',
        onComplete() {
          gsap.to(slot.el, {
            opacity: 0,
            duration: 0.3,
            onComplete() { slot.busy = false; }
          });
        }
      }
    );
  }

  // Gating: el interval sólo corre cuando el scan está activo (0.45 → 0.95).
  let particleInterval = null;
  function startParticles() {
    if (particleInterval) return;
    particleInterval = setInterval(spawnParticle, 200);
  }
  function stopParticles() {
    if (!particleInterval) return;
    clearInterval(particleInterval);
    particleInterval = null;
  }
  // Hookear al ScrollTrigger principal
  const mainST = tl.scrollTrigger;
  if (mainST) {
    const prevOnUpdate = mainST.vars.onUpdate;
    mainST.vars.onUpdate = function (self) {
      if (typeof prevOnUpdate === 'function') prevOnUpdate.call(this, self);
      const p = self.progress;
      if (p >= 0.45 && p <= 0.95) startParticles();
      else stopParticles();
    };
  }

  /* ---- 2) PARALLAX 3D DEL HERO CON MOUSE ------------------------------ */
  const heroEl = warm.querySelector('.hero');
  if (heroEl) {
    gsap.set(warm, { transformPerspective: 1200 });

    // Mapeo: data-parallax existentes → max-shifts del PASO 3
    const layerDefs = [
      { sel: '[data-parallax="bg"]',    shift: 15 },
      { sel: '[data-parallax="mid"]',   shift: 30 },
      { sel: '[data-parallax="front"]', shift: 50 },
      { sel: '[data-parallax="ui"]',    shift: 50 }
    ];

    const tweens = [];
    layerDefs.forEach(({ sel, shift }) => {
      heroEl.querySelectorAll(sel).forEach(el => {
        tweens.push({
          el,
          shift,
          xTo: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
          yTo: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
        });
      });
    });

    heroEl.addEventListener('mousemove', (e) => {
      const r = heroEl.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2;  // -1..1
      const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      tweens.forEach(t => {
        t.xTo(nx * t.shift);
        t.yTo(ny * t.shift);
      });
    });
    heroEl.addEventListener('mouseleave', () => {
      tweens.forEach(t => { t.xTo(0); t.yTo(0); });
    });
  }

  /* ---- 3) BOTÓN CTA MAGNÉTICO ---------------------------------------- */
  warm.querySelectorAll('.btn-pill').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(btn, {
        x: dx * 0.3,
        y: dy * 0.4,
        scale: 1.05,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0, y: 0, scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto'
      });
    });
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = (e.clientX - r.left) + 'px';
      ripple.style.top  = (e.clientY - r.top)  + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---- 4) ENTRADA STAGGER DE LOS CHIPS RECAP EN #mundo --------------- */
  const mundoSection = document.getElementById('mundo');
  if (mundoSection) {
    const chips = mundoSection.querySelectorAll('.destellos-recap .chip');
    if (chips.length) {
      gsap.set(chips, { y: 30, opacity: 0 });
      ScrollTrigger.create({
        trigger: mundoSection,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(chips, {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      });
    }
  }

  /* ===================================================================
     PASO 5 — PERSONAJE COMPAÑERO
     Sigue el scroll del sitio, cambia de pose según la sección visible,
     desaparece durante el pin del hero y vuelve después.
     =================================================================== */
  const companion = document.getElementById('character-companion');
  if (companion) {
    const poseImgs = {};
    companion.querySelectorAll('img[data-pose]').forEach(img => {
      poseImgs[img.dataset.pose] = img;
    });

    let currentPose = null;
    function setPose(pose) {
      if (pose === currentPose) return;
      currentPose = pose;
      Object.values(poseImgs).forEach(img => img.classList.remove('is-active'));
      if (poseImgs[pose]) poseImgs[pose].classList.add('is-active');
    }
    function showCompanion()  { companion.classList.add('is-visible'); }
    function hideCompanion()  { companion.classList.remove('is-visible'); }

    // Estado inicial: oculto. El pin del hero ya muestra al personaje grande.
    hideCompanion();
    setPose('derecha');

    // Mapeo de secciones → pose. Si la sección no existe, se ignora.
    const sectionPoses = [
      { sel: '#quien',    pose: 'izquierda' },
      { sel: '#alicia',   pose: 'derecha'   },
      { sel: '.block-white:nth-of-type(3)', pose: 'arriba' }, // "Qué vas a encontrar"
      { sel: '#mundo',    pose: 'derecha'   },
      { sel: '#pase',     pose: 'abajo'     },
      { sel: '.final-cta',pose: 'arriba'    }
    ];

    sectionPoses.forEach(({ sel, pose }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end:   'bottom 40%',
        onEnter:      () => setPose(pose),
        onEnterBack:  () => setPose(pose)
      });
    });

    // Mostrar/ocultar el compañero según el pin del hero:
    // sale cuando el pin libera, vuelve al hero cuando re-pin.
    if (mainST) {
      ScrollTrigger.create({
        trigger: pin,
        start: 'bottom bottom',  // cuando el pin se está soltando
        onEnter:     () => showCompanion(),
        onLeaveBack: () => hideCompanion()
      });
    } else {
      // Sin pin (mobile / reduced motion) → siempre visible después del hero
      ScrollTrigger.create({
        trigger: '#quien',
        start: 'top 80%',
        onEnter:     () => showCompanion(),
        onLeaveBack: () => hideCompanion()
      });
    }

    // Ocultar al llegar al footer
    const footer = document.querySelector('footer');
    if (footer) {
      ScrollTrigger.create({
        trigger: footer,
        start: 'top 80%',
        onEnter:     () => hideCompanion(),
        onLeaveBack: () => showCompanion()
      });
    }
  }
})();
