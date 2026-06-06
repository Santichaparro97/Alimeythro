    /* Animación de los <h3> internos de #presentacion para que entren
       junto al resto del puzzle (el storytelling no los toca por selector). */
    (function () {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      const isMobile = window.matchMedia('(max-width: 960px)').matches;
      if (isMobile) return;

      const section = document.querySelector('#presentacion');
      if (!section) return;

      const subheadings = section.querySelectorAll('h3');
      if (!subheadings.length) return;

      gsap.fromTo(subheadings,
        { opacity: 0, scale: 0.75, rotation: -2, x: -30, transformOrigin: '0% 50%' },
        {
          opacity: 1, scale: 1, rotation: 0, x: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            end:   'top 5%',
            scrub: 1.2,
            invalidateOnRefresh: true
          }
        }
      );

      ScrollTrigger.refresh();
    })();

    /* Header adaptativo: marca con .active el link cuya sección
       está actualmente bajo el header al scrollear. */
    (function () {
      const nav = document.querySelector('.nav-desktop');
      if (!nav) return;

      const links = Array.from(nav.querySelectorAll('a'));
      const pairs = links
        .map((link) => {
          const href = link.getAttribute('href');
          if (!href || href === '#') return null;
          const target = document.querySelector(href);
          return target ? { link, target } : null;
        })
        .filter(Boolean);

      const inicio = links.find((l) => (l.getAttribute('href') || '') === '#');

      function update() {
        const header = document.querySelector('.site-header');
        const headerH = (header && header.offsetHeight) || 70;
        const probeY = headerH + 40;

        let active = null;
        for (const { link, target } of pairs) {
          const r = target.getBoundingClientRect();
          if (r.top <= probeY && r.bottom > probeY) { active = link; break; }
        }
        if (!active && window.scrollY < 200 && inicio) active = inicio;

        links.forEach((l) => l.classList.remove('active'));
        if (active) active.classList.add('active');
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
