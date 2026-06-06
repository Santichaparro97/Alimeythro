    (function () {
      const items = document.querySelectorAll('#faq .faq-item');
      if (!items.length) return;

      items.forEach((item) => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;
        btn.addEventListener('click', () => {
          const wasOpen = item.classList.contains('is-open');
          items.forEach((i) => {
            i.classList.remove('is-open');
            const b = i.querySelector('.faq-question');
            if (b) b.setAttribute('aria-expanded', 'false');
          });
          if (!wasOpen) {
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    })();
