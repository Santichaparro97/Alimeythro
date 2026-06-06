    (function () {
      function show() {
        var s = document.getElementById('alm-fast-hide');
        if (s) s.remove();
      }
      function jumpToSection() {
        var rid = window.__almReturn;
        // Limpiar siempre el flag para que la próxima entrada sea fresca
        try { sessionStorage.removeItem('alm_return'); } catch (e) {}
        if (!rid) return show();

        var target = document.getElementById(rid);
        if (!target) return show();

        // Liberar el lock del hero (Lenis ya fue neutralizado en el early script)
        try {
          window.dispatchEvent(new WheelEvent('wheel', {
            deltaY: 100, deltaMode: 0, bubbles: true, cancelable: true
          }));
        } catch (e) {}

        function computeY() {
          var header = document.querySelector('.site-header');
          var headerH = (header && header.offsetHeight) || 70;
          return target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
        }

        function applyScroll() {
          var y = computeY();
          document.documentElement.scrollTop = y;
          document.body.scrollTop = y;
          try { window.scrollTo({ top: y, behavior: 'auto' }); } catch (e) {}
        }

        applyScroll();

        // Reaplica varios frames para neutralizar cualquier reset residual
        var frames = 0;
        function loop() {
          if (frames++ >= 12) { show(); return; }
          applyScroll();
          requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);

        // Mostrar body en el próximo frame, ya posicionado
        requestAnimationFrame(show);
      }

      // Correr en LOAD (después del scrollTo(0,0) del motor original)
      if (document.readyState === 'complete') {
        jumpToSection();
      } else {
        window.addEventListener('load', jumpToSection, { once: true });
      }

      // Failsafe: si algo falla y body sigue oculto a los 800ms, mostrarlo igual
      setTimeout(show, 800);
    })();
