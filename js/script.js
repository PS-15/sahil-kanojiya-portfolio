/* ==========================================================================
   SAHIL KANOJIYA — PERSONAL BRAND SITE
   Interactions: smooth scroll, reveals, counters, tilt, magnetic buttons,
   mouse spotlight, typing effect, ambient canvas flow.
   Every library call is guarded so the page still works if a CDN is blocked.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined';
  const hasScrollTrigger = hasGSAP && typeof ScrollTrigger !== 'undefined';
  const hasLenis = typeof Lenis !== 'undefined';
  const hasAOS = typeof AOS !== 'undefined';

  if (hasGSAP && hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis = null;
  if (hasLenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      if (hasScrollTrigger) ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ---------------- AOS init ---------------- */
  if (hasAOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: prefersReducedMotion,
    });
    // Keep AOS in sync with Lenis-driven scroll
    if (lenis) lenis.on('scroll', AOS.refresh);
  }

  /* ---------------- Smooth anchor links ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -70 });
      } else {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
      const navLinks = document.getElementById('navLinks');
      const navToggle = document.getElementById('navToggle');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------------- Header scroll state ---------------- */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('scrollProgressBar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('visible', y > 600);

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (lenis) lenis.on('scroll', onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------------- Cursor spotlight (desktop, hover-capable only) ---------------- */
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    function loop() {
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;
      cursorGlow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------------- Typing effect (hero subheadline) ---------------- */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const phrases = [
      'Building AI Solutions.',
      'Leading Healthcare Operations.',
      'Creating Digital Experiences.',
    ];
    if (prefersReducedMotion) {
      typedEl.textContent = phrases.join(' ');
    } else {
      let phraseIdx = 0, charIdx = 0, deleting = false;
      const TYPE_SPEED = 42, DELETE_SPEED = 26, HOLD = 1400, GAP = 350;

      function tick() {
        const phrase = phrases[phraseIdx];
        if (!deleting) {
          charIdx++;
          typedEl.textContent = phrase.slice(0, charIdx);
          if (charIdx === phrase.length) {
            deleting = true;
            setTimeout(tick, HOLD);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIdx--;
          typedEl.textContent = phrase.slice(0, charIdx);
          if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            setTimeout(tick, GAP);
            return;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      }
      tick();
    }
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const strength = 0.3;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        if (hasGSAP) {
          gsap.to(btn, { x: relX * strength, y: relY * strength, duration: 0.4, ease: 'power3.out' });
        } else {
          btn.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
        }
      });
      btn.addEventListener('mouseleave', () => {
        if (hasGSAP) {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        } else {
          btn.style.transform = 'translate(0, 0)';
        }
      });
    });
  }

  /* ---------------- Tilt cards ---------------- */
  if (window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      const maxTilt = 6;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - py) * maxTilt * 2;
        const transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        if (hasGSAP) {
          gsap.to(card, { duration: 0.4, ease: 'power2.out', transform });
        } else {
          card.style.transform = transform;
        }
      });
      card.addEventListener('mouseleave', () => {
        const transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
        if (hasGSAP) {
          gsap.to(card, { duration: 0.5, ease: 'power2.out', transform });
        } else {
          card.style.transform = transform;
        }
      });
    });
  }

  /* ---------------- GSAP scroll-triggered section fades (supplements AOS) ---------------- */
  if (hasGSAP && hasScrollTrigger && !prefersReducedMotion) {
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 85%' },
        }
      );
    });
  }

  /* ---------------- Ambient flow canvas (hero signature element) ----------------
     Nodes drifting and connecting along soft paths — a visual nod to claims/data
     moving through an operational pipeline. Purely decorative, GPU-light.       */
  const canvas = document.getElementById('flowCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let nodes = [];
    const COLORS = ['rgba(91,140,255,', 'rgba(139,92,246,', 'rgba(0,212,255,'];
    const NODE_COUNT_BASE = 46;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      const count = window.innerWidth < 700 ? Math.round(NODE_COUNT_BASE * 0.5) : NODE_COUNT_BASE;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    const LINK_DIST = 140;

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.14;
            ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = n.color + '0.85)';
        ctx.shadowColor = n.color + '0.9)';
        ctx.shadowBlur = 6;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); initNodes(); }, 200);
    });
  }
});
