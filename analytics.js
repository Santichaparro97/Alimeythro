/* =========================================================================
   CAPTURA DE TRÁFICO — Mundo Alimeythor
   -------------------------------------------------------------------------
   Registra una "pageview" por cada carga de página en la tabla `pageviews`
   de Supabase. No usa cookies ni datos personales: solo la ruta visitada,
   el referrer, el tipo de dispositivo y un id anónimo de visitante guardado
   en el navegador (para contar visitantes únicos).

   Requiere que analytics-config.js se haya cargado ANTES que este archivo.
   ========================================================================= */
(function () {
  var C = window.ALM_ANALYTICS;

  // Sin configuración válida → no hacemos nada (deploy seguro).
  if (!C || !C.url || !C.anonKey || C.url.indexOf("TU-") !== -1 || C.anonKey.indexOf("TU-") !== -1) return;

  // No registramos las visitas al propio panel de administrador.
  if (location.pathname.indexOf("admin.html") !== -1) return;

  try {
    // Id anónimo de visitante (persiste por navegador) para contar únicos.
    var vid = null;
    try { vid = localStorage.getItem("alm_vid"); } catch (e) {}
    if (!vid) {
      vid = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : (Date.now().toString(36) + Math.random().toString(16).slice(2));
      try { localStorage.setItem("alm_vid", vid); } catch (e) {}
    }

    var device = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? "mobile" : "desktop";

    var row = {
      path:       location.pathname + location.search,
      referrer:   document.referrer || null,
      visitor_id: vid,
      device:     device,
      ua:         (navigator.userAgent || "").slice(0, 300)
    };

    fetch(C.url.replace(/\/+$/, "") + "/rest/v1/pageviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": C.anonKey,
        "Authorization": "Bearer " + C.anonKey,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(row),
      keepalive: true            // no se pierde si el usuario navega enseguida
    }).catch(function () { /* silencioso: nunca romper la web por la analítica */ });
  } catch (e) { /* no-op */ }
})();
