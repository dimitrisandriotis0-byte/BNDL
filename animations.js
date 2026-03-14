// ============================================
// BNDL Animations — GSAP, ScrollTrigger, Lenis
// ============================================

const Animations = {
  lenis: null,

  init() {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.initLenis();
    this.initScrollReveal();
    this.initParallax();
    this.initCountUp();
    this.initMagneticButtons();
    this.initCardTilt();
    this.initCustomCursor();
  },

  // Lenis smooth scroll
  initLenis() {
    if (typeof Lenis === 'undefined') return;
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Sync with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && gsap.ticker) {
      this.lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      });
      gsap.ticker.add((time) => this.lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  },

  // IntersectionObserver scroll reveal
  initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  },

  // Parallax on hero
  initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const video = hero.querySelector('.hero__video');
    const content = hero.querySelector('.hero__content');
    if (!video && !content) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      if (video) {
        gsap.to(video, {
          y: 150,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        });
      }

      if (content) {
        gsap.to(content, {
          y: -80,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: true }
        });
      }
    }
  },

  // Count-up animation
  initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  },

  animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  },

  // Magnetic buttons
  initMagneticButtons() {
    document.querySelectorAll('.btn--magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => btn.style.transition = '', 400);
      });
    });
  },

  // Card 3D tilt effect
  initCardTilt() {
    document.querySelectorAll('.bundle-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => card.style.transition = '', 500);
      });
    });
  },

  // Custom cursor
  initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));

    const interactiveSelectors = 'a, button, .btn, .bundle-card, .category-card, .filter-tab, input, textarea, select, .theme-toggle, .lang-toggle, .nav__cart';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) cursor.classList.add('hovering');
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) cursor.classList.remove('hovering');
    });

    const lerp = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(lerp);
    };
    requestAnimationFrame(lerp);
  },

  // How It Works line animation
  initStepsLine() {
    const line = document.querySelector('.steps__line-fill');
    if (!line) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (window.innerWidth <= 767) {
            line.style.height = '100%';
          } else {
            line.style.width = '100%';
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(line.parentElement);
  },

  // Staggered grid animation (for category cards, bundle cards)
  initStaggerGrid(selector) {
    const container = document.querySelector(selector);
    if (!container) return;

    const children = container.children;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 80}ms`;
            child.classList.add('revealed');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(container);
  },

  // Blur-up image loading
  initBlurUpImages() {
    document.querySelectorAll('.blur-up').forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
      }
    });
  },

  // Horizontal scroll section
  initHorizontalScroll(selector) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const section = document.querySelector(selector);
    if (!section) return;

    const track = section.querySelector('.horizontal-track');
    if (!track) return;

    gsap.registerPlugin(ScrollTrigger);
    const totalWidth = track.scrollWidth - section.offsetWidth;

    gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });
  }
};
