// ============================================
// BNDL Cart — localStorage Cart System
// ============================================

const Cart = {
  KEY: 'bndl-cart',
  discount: null,

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  addItem(bundleId, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.id === bundleId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: bundleId, qty });
    }
    this.save(items);
    this.animateBadge();
    this.showToast();
  },

  removeItem(bundleId) {
    const items = this.getItems().filter(i => i.id !== bundleId);
    this.save(items);
  },

  updateQty(bundleId, qty) {
    const items = this.getItems();
    const item = items.find(i => i.id === bundleId);
    if (item) {
      if (qty <= 0) {
        this.removeItem(bundleId);
        return;
      }
      item.qty = qty;
      this.save(items);
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  getCount() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  getSubtotal() {
    const items = this.getItems();
    return items.reduce((sum, item) => {
      const bundle = BUNDLES.find(b => b.id === item.id);
      return sum + (bundle ? bundle.price * item.qty : 0);
    }, 0);
  },

  getDiscountAmount() {
    if (!this.discount) return 0;
    const subtotal = this.getSubtotal();
    if (this.discount.type === 'percent') {
      return Math.round(subtotal * this.discount.value / 100);
    }
    return this.discount.value;
  },

  getTotal() {
    const subtotal = this.getSubtotal();
    const discountAmt = this.getDiscountAmount();
    const afterDiscount = subtotal - discountAmt;
    const vat = Math.round(afterDiscount * 0.24);
    return { subtotal, discount: discountAmt, vat, total: afterDiscount + vat };
  },

  applyDiscount(code) {
    const upper = code.toUpperCase().trim();
    if (DISCOUNT_CODES[upper]) {
      this.discount = DISCOUNT_CODES[upper];
      return true;
    }
    this.discount = null;
    return false;
  },

  updateBadge() {
    const count = this.getCount();
    document.querySelectorAll('.nav__cart-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('visible', count > 0);
    });
  },

  animateBadge() {
    document.querySelectorAll('.nav__cart-count').forEach(el => {
      el.classList.remove('bounce');
      void el.offsetWidth; // reflow
      el.classList.add('bounce');
    });
  },

  showToast() {
    const lang = Language.current;
    const text = lang === 'gr' ? 'Προστέθηκε στο καλάθι!' : 'Added to cart!';
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2000);
  }
};
