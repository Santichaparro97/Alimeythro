    /* ====== Lógica del modal de comentarios ====== */
    (function () {
      const useFirebase = FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== "PEGAR_AQUI";
      let db = null;

      if (useFirebase) {
        try {
          firebase.initializeApp(FIREBASE_CONFIG);
          db = firebase.firestore();
        } catch (e) {
          console.warn('Firebase init falló:', e);
        }
      }

      const modal     = document.getElementById('com-modal');
      const openBtn   = document.getElementById('com-open');
      const closeBtn  = document.getElementById('com-close');
      const form      = document.getElementById('com-form');
      const list      = document.getElementById('com-list');
      const stars     = document.getElementById('com-stars').querySelectorAll('.star');
      const submitBtn = document.getElementById('com-submit');
      const demoNote  = document.getElementById('com-demo-note');
      if (!db) demoNote.style.display = '';

      let rating = 5;

      // --- Stars ---
      function paintStars(n) {
        stars.forEach(s => s.classList.toggle('active', +s.dataset.val <= n));
      }
      paintStars(5);
      stars.forEach(s => {
        s.addEventListener('click', () => { rating = +s.dataset.val; paintStars(rating); });
        s.addEventListener('mouseenter', () => paintStars(+s.dataset.val));
        s.addEventListener('mouseleave', () => paintStars(rating));
      });

      // --- Modal open/close ---
      function open() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        loadComments();
      }
      function close() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      openBtn.addEventListener('click', (e) => { e.preventDefault(); open(); });
      closeBtn.addEventListener('click', close);
      modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
      });

      // --- Utils ---
      function escape(s) {
        return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      }
      function fmtDate(ts) {
        const d = ts instanceof Date ? ts : (ts && ts.toDate ? ts.toDate() : new Date(ts));
        return d.toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' });
      }
      function renderItem(c) {
        const ageTxt = c.age != null ? ` · hijo/a ${c.age} años` : '';
        const r = Math.max(0, Math.min(5, c.rating || 0));
        const starsTxt = '★'.repeat(r) + '☆'.repeat(5 - r);
        return `<div class="com-item">
          <div class="com-item-head">
            <span class="com-item-name">${escape(c.name || 'Anónimo')}</span>
            <span class="com-item-stars" aria-label="${r} de 5 estrellas">${starsTxt}</span>
            <span class="com-item-meta">${fmtDate(c.createdAt || Date.now())}${ageTxt}</span>
          </div>
          <div class="com-item-text">${escape(c.text || '')}</div>
        </div>`;
      }

      // --- Storage local (fallback) ---
      const LS_KEY = 'alm_comentarios_demo';
      const getLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch (e) { return []; } };
      const saveLocal = (arr) => { try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch (e) {} };

      // --- Load list ---
      function loadComments() {
        list.innerHTML = '<div class="com-empty">Cargando…</div>';
        if (db) {
          db.collection('comentarios').orderBy('createdAt', 'desc').limit(50).get()
            .then(snap => {
              if (snap.empty) {
                list.innerHTML = '<div class="com-empty">Sé el primero en compartir tu experiencia ✨</div>';
                return;
              }
              list.innerHTML = snap.docs.map(d => renderItem(d.data())).join('');
            })
            .catch(err => {
              console.warn('Read fail:', err);
              list.innerHTML = '<div class="com-empty">No pudimos cargar las experiencias. Probá de nuevo.</div>';
            });
        } else {
          const arr = getLocal().slice().reverse();
          list.innerHTML = arr.length
            ? arr.map(renderItem).join('')
            : '<div class="com-empty">Sé el primero en compartir tu experiencia ✨</div>';
        }
      }

      // --- Submit ---
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('com-name').value.trim();
        const age  = document.getElementById('com-age').value.trim();
        const text = document.getElementById('com-text').value.trim();
        if (!name || !text || !age) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Publicando…';

        const data = {
          name: name.slice(0, 60),
          age: parseInt(age, 10),
          rating: rating,
          text: text.slice(0, 500),
          createdAt: db ? firebase.firestore.FieldValue.serverTimestamp() : Date.now()
        };

        try {
          if (db) {
            await db.collection('comentarios').add(data);
          } else {
            const arr = getLocal();
            arr.push({ ...data, createdAt: Date.now() });
            saveLocal(arr);
          }
          form.reset();
          rating = 5; paintStars(5);
          submitBtn.textContent = '¡Gracias por compartir!';
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Publicar mi experiencia';
          }, 1800);
          loadComments();
        } catch (err) {
          console.warn('Write fail:', err);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Error al publicar';
        }
      });
    })();
