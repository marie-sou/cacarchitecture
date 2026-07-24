/* ================================================================
   CAC CONSULTING — javascript.js
   Loader · Curseur · Header · Parallaxe · Particules · Fade
   Compteurs · Filtres · Carousel-cartes · Lightbox multi-images
   ================================================================ */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ══════════ 1. LOADER ══════════ */
  function initLoader() {
    const loader = $('#page-loader');
    if (!loader) return;
    const hide = () => setTimeout(() => loader.classList.add('hidden'), 600);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
  }

  /* ══════════ 2. CURSEUR ══════════ */
  function initCursor() {
    if (isTouch) return;
    const dot = $('#cursor'), ring = $('#cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    (function loop() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    const hoverable = 'a, button, .project-card, .service-item, .filter-btn, .preview-card, .lb-thumb, input, textarea';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverable)) {
        dot.style.width = dot.style.height = '18px';
        ring.style.width = ring.style.height = '60px';
        ring.style.borderColor = 'rgba(201,168,76,0.8)';
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverable)) {
        dot.style.width = dot.style.height = '8px';
        ring.style.width = ring.style.height = '40px';
        ring.style.borderColor = 'rgba(201,168,76,0.5)';
      }
    });
  }

  /* ══════════ 3. HEADER ══════════ */
  function initHeader() {
    const header = $('header');
    if (!header) return;

    // Active link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    $$('nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });

    // Scroll
    const topBtn = $('#topBtn');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
      if (topBtn) topBtn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });

    // Mobile
    const ham = $('.hamburger'), nav = $('nav');
    if (ham && nav) {
      ham.addEventListener('click', () => {
        const open = ham.classList.toggle('open');
        nav.classList.toggle('open', open);
        ham.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      $$('nav a').forEach(a => a.addEventListener('click', () => {
        ham.classList.remove('open');
        nav.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }));
    }

    if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ══════════ 4. PARALLAXE ══════════ */
  function initParallax() {
    const bg = $('#parallax-bg');
    if (!bg || prefersReduced) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        bg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  /* ══════════ 5. PARTICULES ══════════ */
  function initParticles() {
    const canvas = $('#particles-canvas');
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COUNT = window.innerWidth < 768 ? 30 : 60;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class P {
      constructor() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.r = Math.random() * 1.4 + 0.3;
        this.a = Math.random() * 0.45 + 0.08;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.gold = Math.random() > 0.75;
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

    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${(1 - d / 110) * 0.12})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(draw);
    })();
  }

  /* ══════════ 6. FADE-IN AU SCROLL ══════════ */
  function initFadeIn() {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        o.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    $$('.fade-in').forEach(el => obs.observe(el));
  }

  /* ══════════ 7. COMPTEURS ══════════ */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        o.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => obs.observe(c));
  }

  /* ══════════ 8. PROJETS — cartes, carousel, filtres ══════════ */
  const ProjectsModule = {
    cards: [],

    init() {
      const grid = $('#projects-grid');
      if (!grid) return;

      this.cards = $$('.project-card', grid).map((card, i) => {
        const images = this.parseImages(card);
        const meta = card.querySelector('.project-meta span')?.textContent || '';
        return {
          el: card,
          index: i,
          category: card.dataset.category,
          title: card.dataset.title,
          location: card.dataset.location,
          year: card.dataset.year,
          description: card.dataset.description,
          images,
          meta,
        };
      });

      this.cards.forEach(c => this.setupCard(c));
      this.setupFilters();
      this.setupReveal();
      this.setupLightbox();
    },

    parseImages(card) {
      const raw = card.dataset.images;
      if (!raw) {
        const img = card.querySelector('img');
        return img ? [{ src: img.src, alt: img.alt }] : [];
      }
      try {
        const arr = JSON.parse(raw);
        return arr.map(src => ({ src, alt: card.dataset.title || '' }));
      } catch (e) {
        console.warn('data-images JSON invalide sur', card, e);
        const img = card.querySelector('img');
        return img ? [{ src: img.src, alt: img.alt }] : [];
      }
    },

    setupCard(card) {
      const media = card.el.querySelector('.project-media');
      if (!media) return;

      // Remplace l'image unique par un empilement d'images (une par image du projet)
      media.innerHTML = '';
      const badge = document.createElement('div');
      badge.className = 'project-badge';
      badge.textContent = card.meta;
      media.appendChild(badge);

      card.images.forEach((im, idx) => {
        const img = document.createElement('img');
        img.src = im.src;
        img.alt = im.alt;
        img.loading = 'lazy';
        if (idx === 0) img.classList.add('active');
        media.appendChild(img);
      });

      // Dots si plusieurs images
      if (card.images.length > 1) {
        const dots = document.createElement('div');
        dots.className = 'project-dots';
        card.images.forEach((_, idx) => {
          const d = document.createElement('span');
          d.className = 'project-dot' + (idx === 0 ? ' active' : '');
          dots.appendChild(d);
        });
        media.appendChild(dots);

        // Auto-cycle au survol
        let cycleIdx = 0, timer = null;
        const cycle = () => {
          const imgs = $$('img', media);
          const dotsEls = $$('.project-dot', media);
          imgs[cycleIdx].classList.remove('active');
          dotsEls[cycleIdx].classList.remove('active');
          cycleIdx = (cycleIdx + 1) % card.images.length;
          imgs[cycleIdx].classList.add('active');
          dotsEls[cycleIdx].classList.add('active');
        };
        card.el.addEventListener('mouseenter', () => {
          if (isTouch) return;
          timer = setInterval(cycle, 1400);
        });
        card.el.addEventListener('mouseleave', () => {
          clearInterval(timer);
          const imgs = $$('img', media);
          const dotsEls = $$('.project-dot', media);
          imgs.forEach(i => i.classList.remove('active'));
          dotsEls.forEach(d => d.classList.remove('active'));
          imgs[0].classList.add('active');
          dotsEls[0].classList.add('active');
          cycleIdx = 0;
        });
      }

      card.el.addEventListener('click', () => Lightbox.open(card, 0));
      card.el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); Lightbox.open(card, 0); }
      });
      card.el.setAttribute('tabindex', '0');
      card.el.setAttribute('role', 'button');
      card.el.setAttribute('aria-label', `Voir la galerie : ${card.title}`);
    },

    setupReveal() {
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach((e, i) => {
          if (!e.isIntersecting) return;
          setTimeout(() => e.target.classList.add('revealed'), i * 70);
          o.unobserve(e.target);
        });
      }, { threshold: 0.08 });
      this.cards.forEach(c => obs.observe(c.el));
    },

    setupFilters() {
      const btns = $$('.filter-btn');
      if (!btns.length) return;
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const f = btn.dataset.filter;
          this.cards.forEach(c => {
            const show = f === 'all' || c.category === f;
            c.el.classList.toggle('hidden', !show);
          });
        });
      });
    },

    setupLightbox() {
      Lightbox.init(this.cards);
    },
  };

  /* ══════════ 9. LIGHTBOX ══════════ */
  const Lightbox = {
    project: null, idx: 0, allCards: [],

    init(cards) {
      this.allCards = cards;
      this.$lb    = $('#lightbox');
      this.$img   = $('#lightbox-img');
      this.$title = $('#lb-title');
      this.$desc  = $('#lb-description');
      this.$meta  = $('#lb-meta');
      this.$count = $('#lb-counter');
      this.$thumbs= $('#lb-thumbs');
      if (!this.$lb) return;

      $('#lb-close').addEventListener('click', () => this.close());
      $('#lb-prev').addEventListener('click', () => this.prev());
      $('#lb-next').addEventListener('click', () => this.next());
      this.$lb.addEventListener('click', e => { if (e.target === this.$lb) this.close(); });

      document.addEventListener('keydown', e => {
        if (!this.$lb.classList.contains('active')) return;
        if (e.key === 'Escape')    this.close();
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight')this.next();
      });

      // Swipe mobile
      let sx = 0;
      this.$lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
      this.$lb.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) { dx > 0 ? this.prev() : this.next(); }
      });
    },

    open(project, idx = 0) {
      this.project = project;
      this.idx = idx;
      this.render();
      this.buildThumbs();
      this.$lb.classList.add('active');
      this.$lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },
    close() {
      this.$lb.classList.remove('active');
      this.$lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    },
    prev() {
      const n = this.project.images.length;
      this.idx = (this.idx - 1 + n) % n;
      this.render();
    },
    next() {
      const n = this.project.images.length;
      this.idx = (this.idx + 1) % n;
      this.render();
    },
    render() {
      const p = this.project;
      const img = p.images[this.idx];
      this.$img.style.opacity = '0';
      this.$img.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.$img.src = img.src;
        this.$img.alt = img.alt;
        this.$img.style.opacity = '1';
        this.$img.style.transform = 'scale(1)';
      }, 120);
      this.$title.textContent = p.title;
      this.$desc.textContent  = p.description || '';
      this.$meta.textContent  = `${p.meta} · ${p.location} · ${p.year}`;
      this.$count.textContent = `${this.idx + 1} / ${p.images.length}`;
      $$('.lb-thumb', this.$thumbs).forEach((t, i) => t.classList.toggle('active', i === this.idx));
    },
    buildThumbs() {
      this.$thumbs.innerHTML = '';
      if (this.project.images.length < 2) return;
      this.project.images.forEach((im, i) => {
        const t = document.createElement('img');
        t.className = 'lb-thumb' + (i === this.idx ? ' active' : '');
        t.src = im.src; t.alt = '';
        t.addEventListener('click', () => { this.idx = i; this.render(); });
        this.$thumbs.appendChild(t);
      });
    },
  };

  /* ══════════ INIT ══════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initHeader();
    initParallax();
    initParticles();
    initFadeIn();
    initCounters();
    ProjectsModule.init();
  });

})();
document.querySelectorAll(".stat-num[data-text]").forEach((el) => {
    const text = el.dataset.text;
    el.textContent = "";

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            let i = 0;

            function typeWriter() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 40); // vitesse de frappe
                }
            }

            typeWriter();
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    observer.observe(el);
});