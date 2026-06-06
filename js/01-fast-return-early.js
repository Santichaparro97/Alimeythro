    (function () {
      try {
        var rid = sessionStorage.getItem('alm_return');
        if (rid) {
          window.__almReturn = rid;
          // Neutralizar Lenis solo para este retorno: evita que su smooth-scroll
          // tire el scroll de vuelta al inicio (Lenis arranca con target=0).
          // El init original hace `if (typeof Lenis !== 'undefined')` — al setearlo
          // a undefined, Lenis no se inicializa en este page-load.
          window.Lenis = undefined;
          // Ocultar body antes de que renderice nada
          var s = document.createElement('style');
          s.id = 'alm-fast-hide';
          s.textContent = 'body{visibility:hidden!important;}';
          (document.head || document.documentElement).appendChild(s);
        }
      } catch (e) {}
    })();
