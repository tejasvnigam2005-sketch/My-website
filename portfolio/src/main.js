/* ═══════════════════════════════════════════════════════════
   TEJASV NIGAM — PORTFOLIO V2.0
   Matrix Rain · Custom Cursor · HUD · GSAP Animations
   ═══════════════════════════════════════════════════════════ */

import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── PRELOADER / BOOT SEQUENCE ───────────────────────────── */
function runBootSequence() {
  const preloader = document.getElementById('preloader');
  const mainContent = document.getElementById('main-content');
  const bootLines = document.querySelectorAll('.boot-line');
  const progressBar = document.getElementById('progress-bar');
  const percentEl = document.getElementById('preloader-percent');

  let lineIndex = 0;
  const totalLines = bootLines.length;

  const showLine = () => {
    if (lineIndex >= totalLines) {
      gsap.to(progressBar, { width: '100%', duration: 0.5, ease: 'power2.out' });
      if (percentEl) percentEl.textContent = '100%';
      setTimeout(() => {
        gsap.to(preloader, {
          opacity: 0, scale: 1.05, filter: 'blur(10px)',
          duration: 0.8, ease: 'power3.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            mainContent.classList.remove('hidden');
            gsap.to(mainContent, { opacity: 1, duration: 0.6 });
            initPortfolio();
          }
        });
      }, 400);
      return;
    }

    bootLines[lineIndex].classList.add('visible');
    const progress = ((lineIndex + 1) / totalLines) * 100;
    gsap.to(progressBar, { width: `${progress}%`, duration: 0.2 });
    if (percentEl) percentEl.textContent = `${Math.round(progress)}%`;
    lineIndex++;
    setTimeout(showLine, 260);
  };

  setTimeout(showLine, 600);
}

/* ── MATRIX RAIN ─────────────────────────────────────────── */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|;:<>テジャスヴニガム';
  const fontSize = 12;
  const columns = Math.floor(width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(3, 3, 17, 0.08)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#00ff8815';
    ctx.font = `${fontSize}px JetBrains Mono, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Random brightness
      const brightness = Math.random();
      if (brightness > 0.98) {
        ctx.fillStyle = '#00ff88';
      } else if (brightness > 0.95) {
        ctx.fillStyle = '#00ff8844';
      } else {
        ctx.fillStyle = '#00ff8812';
      }

      ctx.fillText(text, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const glow = document.getElementById('cursor-glow');
  const coordsEl = document.getElementById('mouse-coords');

  if (!dot || !ring || window.innerWidth < 768) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
    if (coordsEl) {
      coordsEl.textContent = `${String(Math.round(mouseX)).padStart(4, '0')}:${String(Math.round(mouseY)).padStart(4, '0')}`;
    }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    if (glow) {
      glow.style.left = `${ringX}px`;
      glow.style.top = `${ringY}px`;
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects on interactive elements
  const interactiveEls = document.querySelectorAll('a, button, input, textarea, .card-glass, .skill-card');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '10px';
      dot.style.height = '10px';
      ring.style.width = '50px';
      ring.style.height = '50px';
      ring.style.borderColor = 'var(--green)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '6px';
      dot.style.height = '6px';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'var(--green-dim)';
    });
  });
}

/* ── HUD SCROLL PROGRESS ─────────────────────────────────── */
function initHUD() {
  const scrollEl = document.getElementById('scroll-progress');
  if (!scrollEl) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.round((scrollTop / docHeight) * 100);
    scrollEl.textContent = `${progress}%`;
  });
}

/* ── 3D CARD HOVER ───────────────────────────────────────── */
function init3DCards() {
  const cards = document.querySelectorAll('.card-glass');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      gsap.to(card, {
        rotateX, rotateY, duration: 0.4, ease: 'power2.out',
        transformPerspective: 1200,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

/* ── TYPING EFFECT ───────────────────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('hero-typed');
  if (!el) return;

  const strings = [
    'Vibe Coder · GenAI Builder · Full Stack Dev',
    'Mastered 50+ AI Tools. Still counting.',
    'Cursor is his blade. Code is his weapon.',
    'The one who prompts, ships, then reads.',
    'Building the future with AI-first code.',
  ];

  let stringIndex = 0, charIndex = 0, isDeleting = false, pause = false;

  function type() {
    const current = strings[stringIndex];
    if (pause) { setTimeout(type, 1800); pause = false; isDeleting = true; return; }
    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) { pause = true; }
      setTimeout(type, 40 + Math.random() * 25);
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) { isDeleting = false; stringIndex = (stringIndex + 1) % strings.length; }
      setTimeout(type, 20);
    }
  }

  setTimeout(type, 1000);
}

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('.stat-value[data-count]').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    ScrollTrigger.create({
      trigger: counter, start: 'top 85%', once: true,
      onEnter: () => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { current = target; clearInterval(timer); }
          counter.textContent = Math.round(current);
        }, 35);
      }
    });
  });
}

/* ── GSAP SCROLL ANIMATIONS ──────────────────────────────── */
function initScrollAnimations() {
  // Navbar
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -100',
    onUpdate: (self) => {
      if (self.direction === -1 || window.scrollY > 100) navbar.classList.add('visible');
      if (window.scrollY < 50) navbar.classList.remove('visible');
    }
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' },
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    });
  });

  // Section dividers
  gsap.utils.toArray('.section-divider').forEach(divider => {
    gsap.from(divider, {
      scrollTrigger: { trigger: divider, start: 'top 90%', toggleActions: 'play none none none' },
      scaleX: 0, opacity: 0, duration: 0.8, ease: 'power3.out',
    });
  });

  // Hero animations
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.from('.hero-top-tag', { y: -20, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' });
    gsap.from('.hero-glitch-container', { scale: 0.6, opacity: 0, duration: 1.4, ease: 'power4.out', delay: 0.3 });
    gsap.from('.hero-title-underline', { scaleX: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' });
    gsap.from('.hero-subtitle-line', { y: 30, opacity: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' });
    gsap.from('.hero-tagline', { y: 30, opacity: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' });
    gsap.from('.hero-cta-group', { y: 30, opacity: 0, duration: 0.8, delay: 1.1, ease: 'power3.out' });
    gsap.from('.hero-stats-bar', { y: 40, opacity: 0, duration: 0.8, delay: 1.3, ease: 'power3.out' });
  }

  // Hero parallax
  gsap.to('.hero-content', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
    scale: 0.85, opacity: 0, y: -80,
  });
  gsap.to('.hero-grid-overlay', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
    scale: 1.4, opacity: 0,
  });
  // Orb parallax
  gsap.utils.toArray('.hero-orb').forEach((orb, i) => {
    gsap.to(orb, {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
      y: -(100 + i * 50), opacity: 0,
    });
  });
  // Scroll indicator fade
  gsap.to('.scroll-indicator', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '15% top', scrub: 1 },
    opacity: 0, y: 20,
  });

  // Player data cards
  gsap.from('#profile-card', {
    scrollTrigger: { trigger: '#player-data', start: 'top 75%', toggleActions: 'play none none none' },
    x: -80, opacity: 0, duration: 1, ease: 'power3.out',
  });
  gsap.from('#arc-card', {
    scrollTrigger: { trigger: '#player-data', start: 'top 75%', toggleActions: 'play none none none' },
    x: 80, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out',
  });

  // Terminal lines stagger
  gsap.utils.toArray('.terminal-line').forEach((line, i) => {
    gsap.from(line, {
      scrollTrigger: { trigger: line, start: 'top 90%', toggleActions: 'play none none none' },
      x: -20, opacity: 0, duration: 0.5, delay: i * 0.04, ease: 'power2.out',
    });
  });

  // Skill cards with power bar animation
  gsap.utils.toArray('.ability-category').forEach(category => {
    const cards = category.querySelectorAll('.skill-card');
    gsap.from(cards, {
      scrollTrigger: { trigger: category, start: 'top 80%', toggleActions: 'play none none none' },
      scale: 0.7, opacity: 0, y: 40, duration: 0.7, stagger: 0.06, ease: 'back.out(1.7)',
    });
    // Animate power bars
    cards.forEach(card => {
      const powerBar = card.querySelector('.skill-power-bar');
      if (powerBar) {
        const power = powerBar.style.getPropertyValue('--power');
        powerBar.style.width = '0%';
        ScrollTrigger.create({
          trigger: card, start: 'top 85%', once: true,
          onEnter: () => { gsap.to(powerBar, { width: power, duration: 1.5, ease: 'power2.out', delay: 0.3 }); }
        });
      }
    });
  });

  // Quest cards
  gsap.utils.toArray('.quest-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
      x: i % 2 === 0 ? -60 : 60, opacity: 0, duration: 0.8, ease: 'power3.out',
    });
  });

  // Immersive zoom for sections
  gsap.utils.toArray('.section').forEach((section, i) => {
    if (i === 0) return;
    gsap.fromTo(section, { scale: 0.97 }, {
      scale: 1,
      scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 55%', scrub: 1 },
      ease: 'power1.out',
    });
  });

  // Footer
  gsap.from('#footer .footer-content', {
    scrollTrigger: { trigger: '#footer', start: 'top 90%', toggleActions: 'play none none none' },
    y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
  });
}

/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

/* ── MOBILE NAV ──────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => { links.classList.remove('open'); toggle.classList.remove('active'); });
  });
}

/* ── CONTACT FORM ────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.classList.add('loading');
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = '<span class="submit-text">> SIGNAL SENT ✓</span>';
      submitBtn.style.background = '#28CA41';
      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = '<span class="submit-text">> TRANSMIT_SIGNAL</span><span class="submit-loading">> TRANSMITTING...</span>';
        submitBtn.style.background = '';
      }, 3000);
    }, 1500);
  });
}

/* ── PARALLAX FLOATING SHAPES ────────────────────────────── */
function initFloatingShapes() {
  const main = document.getElementById('main-content');
  if (!main) return;

  for (let i = 0; i < 8; i++) {
    const shape = document.createElement('div');
    const size = Math.random() * 150 + 40;
    const isCircle = Math.random() > 0.5;
    Object.assign(shape.style, {
      position: 'absolute', width: `${size}px`, height: `${size}px`,
      borderRadius: isCircle ? '50%' : '8px',
      border: `1px solid ${Math.random() > 0.5 ? 'rgba(0,255,136,0.04)' : 'rgba(0,229,255,0.03)'}`,
      left: `${Math.random() * 100}%`, top: `${Math.random() * 500}vh`,
      pointerEvents: 'none', zIndex: '0',
      transform: `rotate(${Math.random() * 360}deg)`,
    });
    main.appendChild(shape);

    gsap.to(shape, {
      y: () => -window.innerHeight * ((i % 3 + 1) * 0.25),
      rotation: `+=${Math.random() * 120}`,
      scrollTrigger: { trigger: main, start: 'top top', end: 'bottom bottom', scrub: 2 + Math.random() * 2 },
    });
  }
}

/* ── INITIALIZE EVERYTHING ───────────────────────────────── */
function initPortfolio() {
  initMatrixRain();
  initCustomCursor();
  initHUD();
  init3DCards();
  initTypingEffect();
  initCounters();
  initScrollAnimations();
  initFloatingShapes();
  initActiveNav();
  initMobileNav();
  initContactForm();
}

document.addEventListener('DOMContentLoaded', runBootSequence);
