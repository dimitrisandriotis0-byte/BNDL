// ============================================
// BNDL App — Main Init & Shared Components
// ============================================

const App = {
  init() {
    Theme.init();
    Language.init();
    Cart.updateBadge();
    this.injectNav();
    this.injectFooter();
    this.injectCursor();
    this.injectCookieBanner();
    this.injectBackToTop();
    this.injectScrollProgress();
    this.initPreloader();
    this.initScrollProgress();
    this.initBackToTop();
    this.initNavScroll();
    this.initMobileMenu();

    // Init animations after short delay for DOM paint
    requestAnimationFrame(() => {
      Animations.init();
      Animations.initBlurUpImages();
    });
  },

  // ---- Navigation ----
  injectNav() {
    const nav = document.createElement('nav');
    nav.className = 'nav';
    nav.id = 'nav';
    nav.innerHTML = `
      <div class="nav__inner">
        <div class="nav__logo">
          <a href="index.html" style="color:inherit;text-decoration:none">BNDL</a>
          <span class="nav__logo-sub">powered by <a href="https://succit.vercel.app" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">Succit</a></span>
        </div>
        <div class="nav__links hide-mobile">
          <a href="bundles.html" class="nav__link" data-i18n="nav.bundles">Bundles</a>
          <a href="subscriptions.html" class="nav__link" data-i18n="nav.membership">Membership</a>
          <a href="about.html" class="nav__link" data-i18n="nav.about">About</a>
          <a href="faq.html" class="nav__link" data-i18n="nav.faq">FAQ</a>
          <a href="blog.html" class="nav__link" data-i18n="nav.blog">Blog</a>
          <a href="contact.html" class="nav__link" data-i18n="nav.contact">Contact</a>
          <a href="book-call.html" class="nav__link" data-i18n="nav.bookCall">Book a Call</a>
        </div>
        <div class="nav__actions">
          <button class="theme-toggle" aria-label="Toggle dark mode" onclick="Theme.toggle()">
            <span class="theme-toggle__knob"></span>
          </button>
          <button class="lang-toggle" onclick="Language.toggle()">${Language.current === 'en' ? 'GR' : 'EN'}</button>
          <a href="cart.html" class="nav__cart" aria-label="Cart">
            <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor"/><path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-linecap="round"/></svg>
            <span class="nav__cart-count">0</span>
          </a>
          <button class="nav__menu-toggle hide-desktop" aria-label="Menu" onclick="App.toggleMobile()">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    `;
    document.body.prepend(nav);
  },

  // ---- Mobile Menu ----
  injectMobileMenu() {
    if (document.querySelector('.mobile-menu')) return;
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobileMenu';
    menu.innerHTML = `
      <a href="bundles.html" class="mobile-menu__link" data-i18n="nav.bundles">Bundles</a>
      <a href="subscriptions.html" class="mobile-menu__link" data-i18n="nav.membership">Membership</a>
      <a href="build-your-own.html" class="mobile-menu__link" data-i18n="nav.buildOwn">Build Your Own</a>
      <a href="about.html" class="mobile-menu__link" data-i18n="nav.about">About</a>
      <a href="faq.html" class="mobile-menu__link" data-i18n="nav.faq">FAQ</a>
      <a href="blog.html" class="mobile-menu__link" data-i18n="nav.blog">Blog</a>
      <a href="contact.html" class="mobile-menu__link" data-i18n="nav.contact">Contact</a>
      <a href="book-call.html" class="mobile-menu__link" data-i18n="nav.bookCall">Book a Call</a>
      <div class="mobile-menu__controls">
        <button class="theme-toggle" aria-label="Toggle dark mode" onclick="Theme.toggle()">
          <span class="theme-toggle__knob"></span>
        </button>
        <button class="lang-toggle" onclick="Language.toggle()">${Language.current === 'en' ? 'GR' : 'EN'}</button>
      </div>
    `;
    document.body.appendChild(menu);
  },

  toggleMobile() {
    this.injectMobileMenu();
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.nav__menu-toggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  },

  initMobileMenu() {
    // Close on link click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('mobile-menu__link')) {
        const menu = document.getElementById('mobileMenu');
        if (menu) menu.classList.remove('active');
        document.querySelector('.nav__menu-toggle')?.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  },

  // ---- Footer ----
  injectFooter() {
    // Check if footer already exists to prevent duplicates
    if (document.querySelector('.footer')) return;
    
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer__grid reveal">
          <div>
            <div class="footer__brand-name">BNDL</div>
            <p class="footer__brand-desc" data-i18n="footer.desc">Premium branded merchandise bundles for businesses and creators. Fixed prices, custom branding, fast production.</p>
            <div class="footer__social">
              <a href="#" class="footer__social-link" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg></a>
              <a href="#" class="footer__social-link" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
              <a href="#" class="footer__social-link" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg></a>
              <a href="#" class="footer__social-link" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
            </div>
          </div>
          <div>
            <h4 class="footer__heading" data-i18n="footer.shop">Shop</h4>
            <a href="bundles.html" class="footer__link" data-i18n="nav.bundles">Bundles</a>
            <a href="subscriptions.html" class="footer__link" data-i18n="nav.membership">Membership</a>
            <a href="build-your-own.html" class="footer__link" data-i18n="nav.buildOwn">Build Your Own</a>
            <a href="cart.html" class="footer__link">Cart</a>
          </div>
          <div>
            <h4 class="footer__heading" data-i18n="footer.company">Company</h4>
            <a href="about.html" class="footer__link" data-i18n="nav.about">About</a>
            <a href="blog.html" class="footer__link" data-i18n="nav.blog">Blog</a>
            <a href="book-call.html" class="footer__link" data-i18n="nav.bookCall">Book a Call</a>
          </div>
          <div>
            <h4 class="footer__heading" data-i18n="footer.support">Support</h4>
            <a href="faq.html" class="footer__link" data-i18n="nav.faq">FAQ</a>
            <a href="contact.html" class="footer__link" data-i18n="nav.contact">Contact</a>
          </div>
          <div>
            <h4 class="footer__heading" data-translate="legal-title">Legal</h4>
            <a href="returns.html" class="footer__link" data-translate="returns">Πολιτική Επιστροφών</a>
            <a href="legal.html" class="footer__link" data-translate="legal">Νομικοί Όροι</a>
            <a href="terms.html" class="footer__link">Terms of Service</a>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} BNDL. <span data-i18n="footer.rights">All rights reserved.</span></span>
          <span class="footer__powered"><span data-i18n="footer.powered">powered by</span> <a href="https://succit.vercel.app" target="_blank" rel="noopener">Succit</a></span>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  },

  // ---- Custom Cursor ----
  injectCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
  },

  // ---- Cookie Banner ----
  injectCookieBanner() {
    if (localStorage.getItem('bndl-cookies-accepted')) return;
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <span class="cookie-banner__text" data-i18n="cookie.text">We use cookies to improve your experience. By continuing to browse, you agree to our use of cookies.</span>
      <button class="cookie-banner__btn" data-i18n="cookie.accept" onclick="App.acceptCookies()">Accept</button>
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('visible'), 1500);
  },

  acceptCookies() {
    localStorage.setItem('bndl-cookies-accepted', 'true');
    document.querySelector('.cookie-banner')?.classList.remove('visible');
    setTimeout(() => document.querySelector('.cookie-banner')?.remove(), 600);
  },

  // ---- Back to Top ----
  injectBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.id = 'backToTop';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>';
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);
  },

  initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
  },

  // ---- Scroll Progress ----
  injectScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.id = 'scrollProgress';
    document.body.prepend(bar);
  },

  initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  },

  // ---- Preloader ----
  initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.add('loaded');
      // Re-apply language after load
      Language.apply();
    }, 1800);
  },

  // ---- Nav Scroll ----
  initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  },

  // ---- Helpers ----
  formatPrice(price) {
    return '€' + price;
  },

  renderBundleCard(bundle) {
    const name = Language.getBundleName(bundle);
    const cat = CATEGORIES.find(c => c.id === bundle.category);
    const catName = cat ? Language.getCategoryName(cat) : bundle.category;
    const t = TRANSLATIONS[Language.current];

    return `
      <a href="bundle.html?id=${bundle.id}" class="bundle-card reveal-scale">
        <div class="bundle-card__image-wrap">
          <img src="${bundle.image}" alt="${name}" class="bundle-card__image blur-up" loading="lazy">
          <span class="bundle-card__badge">${bundle.itemCount} ${t.bundles.items}</span>
          <span class="bundle-card__save-badge">${t.bundles.save} €${bundle.savings}</span>
        </div>
        <div class="bundle-card__content">
          <span class="bundle-card__category">${catName}</span>
          <h3 class="bundle-card__name">${name}</h3>
          <p class="bundle-card__items">${bundle.items.join(', ')}</p>
          <div class="bundle-card__price-row">
            <span class="bundle-card__price">${App.formatPrice(bundle.price)}</span>
            <span class="bundle-card__original-price">${App.formatPrice(bundle.originalPrice)}</span>
            <span class="bundle-card__vat">${t.bundles.vat}</span>
          </div>
          <div class="bundle-card__footer">
            <span class="bundle-card__item-count">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              ${bundle.itemCount} ${t.bundles.items}
            </span>
            <span class="btn btn--sm btn--secondary">${t.bundles.viewBundle}</span>
          </div>
        </div>
      </a>
    `;
  }
};

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
