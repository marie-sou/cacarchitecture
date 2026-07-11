/* ================================================================
   CAC CONSULTING — javascript.js
   Cursor · Loader · Parallax · Particles · Lightbox · Scroll
   ================================================================ */

(function () {
  'use strict';

  /* ── Helpers ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ══════════════════════════════════════════
     1. PAGE LOADER
  ══════════════════════════════════════════ */
  function initLoader() {
    const loader = $('#page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 800);
    });
  }

  /* ══════════════════════════════════════════
     2. CURSEUR PERSONNALISÉ
  ══════════════════════════════════════════ */
  function initCursor() {
    const dot = $('#cursor');
    const ring = $('#cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    // Ring suit avec délai (lerp)
    function lerpRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(lerpRing);
    }
    lerpRing();

    // Agrandissement sur éléments interactifs
    const hoverable = 'a, button, .project-card, .service-item, .lb-close, .lb-nav, #topBtn';
    $$(hoverable).forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%,-50%) scale(2.5)';
        ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
        ring.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.opacity = '1';
      });
    });
  }

  /* ══════════════════════════════════════════
     3. HEADER — scroll + mobile nav
  ══════════════════════════════════════════ */
  function initHeader() {
    const header = $('header');
    if (!header) return;

    // Active nav link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    $$('nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });

    // Scroll
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
      const topBtn = $('#topBtn');
      if (topBtn) topBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    }, { passive: true });

    // Mobile hamburger
    const ham = $('.hamburger');
    const nav = $('nav');
    if (ham && nav) {
      ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        nav.classList.toggle('open');
      });
      // Fermer au clic lien
      $$('nav a').forEach(a => {
        a.addEventListener('click', () => {
          ham.classList.remove('open');
          nav.classList.remove('open');
        });
      });
    }

    // Bouton haut
    const topBtn = $('#topBtn');
    if (topBtn) {
      topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }

  /* ══════════════════════════════════════════
     4. PARALLAXE FOND
  ══════════════════════════════════════════ */
  function initParallax() {
    const bg = $('#parallax-bg');
    if (!bg) return;
    const speed = 0.38;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          bg.style.transform = `translateY(${window.scrollY * speed}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════
     5. PARTICULES
  ══════════════════════════════════════════ */
  function initParticles() {
    let canvas = $('#particles-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'particles-canvas';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    const COUNT = 60;
    let W, H, particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class P {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.4 + 0.3;
        this.a = Math.random() * 0.45 + 0.05;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.gold = Math.random() > 0.78;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.gold
          ? `rgba(201,168,76,${this.a})`
          : `rgba(255,255,255,${this.a * 0.7})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new P());

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // Lignes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${(1 - dist / 110) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(draw);
    }

    draw();
  }

  /* ══════════════════════════════════════════
     6. FADE-IN AU SCROLL
  ══════════════════════════════════════════ */
  function initFadeIn() {
    const faders = $$('.fade-in');
    if (!faders.length) return;

    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    faders.forEach(el => obs.observe(el));

    // Project cards en cascade
    $$('.project-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`;

      const cardObs = new IntersectionObserver(([entry], o) => {
        if (!entry.isIntersecting) return;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        o.unobserve(card);
      }, { threshold: 0.1 });

      cardObs.observe(card);
    });
  }

  /* ══════════════════════════════════════════
     7. LIGHTBOX AVEC NAVIGATION
  ══════════════════════════════════════════ */
  let lbImages = [];
  let lbIndex = 0;

  function buildLightbox() {
    if ($('#lightbox')) return; // déjà présent dans le HTML

    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
      <div class="lb-inner">
        <img id="lightbox-img" src="" alt="">
        <div class="lb-caption"></div>
      </div>
      <div class="lb-close" id="lb-close" title="Fermer">&#215;</div>
      <div class="lb-nav lb-prev" id="lb-prev" title="Précédent">&#8592;</div>
      <div class="lb-nav lb-next" id="lb-next" title="Suivant">&#8594;</div>
    `;
    document.body.appendChild(lb);
  }

  function openLightbox(element) {
    buildLightbox();

    // Collecter toutes les images de la galerie active
    const section = element.closest('section');
    lbImages = section
      ? $$('.project-card img', section)
      : $$('.project-card img');

    lbIndex = lbImages.indexOf(element);
    showLbImage(lbIndex);

    const lb = $('#lightbox');
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    bindLbEvents();
  }

  function showLbImage(idx) {
    const img = $('#lightbox-img');
    const cap = $('.lb-caption');
    if (!img) return;

    img.style.opacity = '0';
    img.style.transform = 'scale(0.96)';

    setTimeout(() => {
      img.src = lbImages[idx].src;
      img.alt = lbImages[idx].alt;
      if (cap) cap.textContent = lbImages[idx].alt;
      img.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 80);
  }

  function closeLightbox() {
    const lb = $('#lightbox');
    if (!lb) return;
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  function bindLbEvents() {
    const lb = $('#lightbox');
    const closeBtn = $('#lb-close');
    const prevBtn = $('#lb-prev');
    const nextBtn = $('#lb-next');

    if (closeBtn) closeBtn.onclick = closeLightbox;

    if (prevBtn) prevBtn.onclick = () => {
      lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
      showLbImage(lbIndex);
    };

    if (nextBtn) nextBtn.onclick = () => {
      lbIndex = (lbIndex + 1) % lbImages.length;
      showLbImage(lbIndex);
    };

    lb.onclick = e => { if (e.target === lb) closeLightbox(); };
  }

  document.addEventListener('keydown', e => {
    const lb = $('#lightbox');
    if (!lb || !lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLbImage(lbIndex); }
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; showLbImage(lbIndex); }
  });

  // Exposer pour onclick inline dans HTML
  window.openLightbox = openLightbox;

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initHeader();
    initParallax();
    initParticles();
    initFadeIn();
  });

})();
