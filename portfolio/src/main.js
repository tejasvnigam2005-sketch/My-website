/* ═══════════════════════════════════════════════════════════
   TEJASV NIGAM — PORTFOLIO
   Main JavaScript — GSAP Animations / Parallax / 3D Hover
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

  let lineIndex = 0;
  const totalLines = bootLines.length;

  const showLine = () => {
    if (lineIndex >= totalLines) {
      // All lines shown, finish boot
      gsap.to(progressBar, { width: '100%', duration: 0.5, ease: 'power2.out' });
      setTimeout(() => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            mainContent.classList.remove('hidden');
            gsap.to(mainContent, { opacity: 1, duration: 0.5 });
            initPortfolio();
          }
        });
      }, 400);
      return;
    }

    bootLines[lineIndex].classList.add('visible');
    const progress = ((lineIndex + 1) / totalLines) * 100;
    gsap.to(progressBar, { width: `${progress}%`, duration: 0.2 });
    lineIndex++;
    setTimeout(showLine, 280);
  };

  setTimeout(showLine, 500);
}

/* ── PARTICLE SYSTEM ─────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const PARTICLE_COUNT = Math.min(80, Math.floor(width / 20));

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 ? '#FFD740' : '#69F0AE';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = '#69F0AE';
          ctx.globalAlpha = (1 - dist / 150) * 0.08;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* ── 3D CARD HOVER ───────────────────────────────────────── */
function init3DCards() {
  const cards = document.querySelectorAll('.card-3d');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1200,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
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
  ];

  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pause = false;

  function type() {
    const current = strings[stringIndex];

    if (pause) {
      setTimeout(type, 1500);
      pause = false;
      isDeleting = true;
      return;
    }

    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        pause = true;
      }
      setTimeout(type, 45 + Math.random() * 30);
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
      }
      setTimeout(type, 25);
    }
  }

  setTimeout(type, 800);
}

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-value[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            counter.textContent = Math.round(gsap.getProperty(counter, 'textContent') || 0);
          }
        });
        // Alternative approach for counter
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.round(current);
        }, 30);
      }
    });
  });
}

/* ── GSAP SCROLL ANIMATIONS ──────────────────────────────── */
function initScrollAnimations() {
  // Navbar show on scroll
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -100',
    onUpdate: (self) => {
      if (self.direction === -1 || window.scrollY > 100) {
        navbar.classList.add('visible');
      }
      if (window.scrollY < 50) {
        navbar.classList.remove('visible');
      }
    }
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  });

  // Hero content entrance
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.from('.hero-glitch-container', {
      scale: 0.5,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.2,
    });
    gsap.from('.hero-subtitle-line', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: 'power3.out',
    });
    gsap.from('.hero-tagline', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.8,
      ease: 'power3.out',
    });
    gsap.from('.hero-cta-group', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 1,
      ease: 'power3.out',
    });
    gsap.from('.hero-stats-bar', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 1.2,
      ease: 'power3.out',
    });
  }

  // Immersive zoom on scroll - hero parallax
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    scale: 0.8,
    opacity: 0,
    y: -100,
  });

  gsap.to('.hero-grid-overlay', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    scale: 1.5,
    opacity: 0,
  });

  // Scroll indicator fade
  gsap.to('.scroll-indicator', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '20% top',
      scrub: 1,
    },
    opacity: 0,
    y: 20,
  });

  // Player data cards
  gsap.from('#profile-card', {
    scrollTrigger: {
      trigger: '#player-data',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    x: -80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.from('#arc-card', {
    scrollTrigger: {
      trigger: '#player-data',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    x: 80,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out',
  });

  // Terminal lines stagger
  gsap.utils.toArray('.terminal-line').forEach((line, i) => {
    gsap.from(line, {
      scrollTrigger: {
        trigger: line,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      x: -30,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.05,
      ease: 'power2.out',
    });
  });

  // Skill cards stagger
  gsap.utils.toArray('.ability-category').forEach(category => {
    const cards = category.querySelectorAll('.skill-card');
    gsap.from(cards, {
      scrollTrigger: {
        trigger: category,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      scale: 0.7,
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(1.7)',
    });
  });

  // Quest cards stagger
  gsap.utils.toArray('.quest-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      x: i % 2 === 0 ? -60 : 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  // Contact — no opacity animations, always visible

  // Parallax sections — different depths
  gsap.utils.toArray('.section').forEach((section, i) => {
    if (i === 0) return; // skip hero
    
    const header = section.querySelector('.section-header');
    if (!header) return;

    gsap.from(header.querySelector('.section-tag'), {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      },
      y: 40,
      opacity: 0,
    });
  });

  // Footer
  gsap.from('#footer .footer-content', {
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  });
}

/* ── ACTIVE NAV LINK ON SCROLL ───────────────────────────── */
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

/* ── MOBILE NAV TOGGLE ───────────────────────────────────── */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
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

    // Simulate send
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = '<span class="submit-text">> SIGNAL SENT ✓</span>';
      submitBtn.style.background = '#28CA41';

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = '<span class="submit-text">> TRANSMIT_SIGNAL</span><span class="submit-loading">TRANSMITTING...</span>';
        submitBtn.style.background = '';
      }, 3000);
    }, 1500);
  });
}

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 64 },
          duration: 1,
          ease: 'power3.inOut',
        });
      }
    });
  });
}

/* ── IMMERSIVE ZOOM SECTIONS ─────────────────────────────── */
function initImmersiveZoom() {
  // Subtle scale-up as each section enters viewport
  gsap.utils.toArray('.section').forEach((section, i) => {
    if (i === 0) return; // Skip hero

    gsap.fromTo(section, 
      { scale: 0.97 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 95%',
          end: 'top 60%',
          scrub: 1,
        },
        ease: 'power1.out',
      }
    );
  });
}

/* ── PARALLAX BACKGROUNDS ────────────────────────────────── */
function initParallaxStorytelling() {
  // Create floating geometric shapes for parallax depth
  const main = document.getElementById('main-content');
  const shapes = [];
  const shapeCount = 12;

  for (let i = 0; i < shapeCount; i++) {
    const shape = document.createElement('div');
    shape.className = 'parallax-shape';
    const size = Math.random() * 200 + 50;
    const isCircle = Math.random() > 0.5;
    
    Object.assign(shape.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: isCircle ? '50%' : '8px',
      border: `1px solid ${Math.random() > 0.5 ? 'rgba(105, 240, 174, 0.05)' : 'rgba(255, 215, 64, 0.03)'}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 500}vh`,
      pointerEvents: 'none',
      zIndex: '0',
      transform: `rotate(${Math.random() * 360}deg)`,
    });
    
    main.appendChild(shape);
    shapes.push(shape);
  }

  // Parallax movement
  shapes.forEach((shape, i) => {
    const speed = (i % 3 + 1) * 0.3;
    gsap.to(shape, {
      y: () => -window.innerHeight * speed,
      rotation: `+=${Math.random() * 180}`,
      scrollTrigger: {
        trigger: main,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2 + Math.random() * 2,
      },
    });
  });
}

/* ── CURSOR GLOW EFFECT ──────────────────────────────────── */
function initCursorGlow() {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(105, 240, 174, 0.04) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '1',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s ease',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    gsap.to(glow, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.8,
      ease: 'power2.out',
    });
  });
}

/* ── INITIALIZE EVERYTHING ───────────────────────────────── */
function initPortfolio() {
  initParticles();
  init3DCards();
  initTypingEffect();
  initCounters();
  initScrollAnimations();
  initImmersiveZoom();
  initParallaxStorytelling();
  initActiveNav();
  initMobileNav();
  initContactForm();
  initCursorGlow();
  // initSmoothScroll requires ScrollToPlugin, using native smooth scroll instead
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', runBootSequence);
