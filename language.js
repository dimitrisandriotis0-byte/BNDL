// ============================================
// BNDL Language — EN/GR Switcher
// ============================================

const Language = {
  current: 'en',

  init() {
    const saved = localStorage.getItem('bndl-lang');
    this.current = saved || 'en';
    document.documentElement.setAttribute('lang', this.current === 'gr' ? 'el' : 'en');
    this.apply();
  },

  toggle() {
    this.current = this.current === 'en' ? 'gr' : 'en';
    localStorage.setItem('bndl-lang', this.current);
    document.documentElement.setAttribute('lang', this.current === 'gr' ? 'el' : 'en');
    this.apply();
    // Update lang toggle button text
    document.querySelectorAll('.lang-toggle').forEach(el => {
      el.textContent = this.current === 'en' ? 'GR' : 'EN';
    });
  },

  t(path) {
    const keys = path.split('.');
    let val = TRANSLATIONS[this.current];
    for (const k of keys) {
      if (val && val[k] !== undefined) val = val[k];
      else return path;
    }
    return val;
  },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = this.t(key);
      if (typeof translated === 'string') {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translated;
        } else {
          el.textContent = translated;
        }
      }
    });
    // Handle data-translate attributes for new footer links
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      const translated = this.t(key);
      if (typeof translated === 'string') {
        el.textContent = translated;
      }
    });
    // Handle language switcher on individual pages
    if (typeof updatePageTranslations === 'function') {
      updatePageTranslations();
    }
  },

  getBundleName(bundle) {
    return this.current === 'gr' && bundle.nameGr ? bundle.nameGr : bundle.name;
  },

  getCategoryName(cat) {
    return this.current === 'gr' && cat.nameGr ? cat.nameGr : cat.name;
  }
};
