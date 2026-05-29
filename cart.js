// =============================================
//  SHOPWAVE - Cart Logic
//  Author: Member 3
// =============================================

const Cart = {
  get() {
    return JSON.parse(localStorage.getItem('shopwave_cart') || '[]');
  },
  save(items) {
    localStorage.setItem('shopwave_cart', JSON.stringify(items));
    this.updateBadge();
  },
  add(product, color = '') {
    const items = this.get();
    const key = `${product.id}-${color}`;
    const existing = items.find(i => i.key === key);
    if (existing) {
      existing.qty++;
    } else {
      items.push({ key, id: product.id, name: product.name, price: product.price, emoji: product.emoji, color, qty: 1 });
    }
    this.save(items);
    this.showToast(`${product.name} added to cart!`);
  },
  remove(key) {
    const items = this.get().filter(i => i.key !== key);
    this.save(items);
  },
  updateQty(key, qty) {
    const items = this.get();
    const item = items.find(i => i.key === key);
    if (item) { item.qty = Math.max(1, qty); this.save(items); }
  },
  clear() { localStorage.removeItem('shopwave_cart'); this.updateBadge(); },
  total() { return this.get().reduce((sum, i) => sum + i.price * i.qty, 0); },
  count() { return this.get().reduce((sum, i) => sum + i.qty, 0); },
  updateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      const count = this.count();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },
  showToast(msg) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.style.cssText = `
        position:fixed; bottom:28px; right:28px; z-index:9999;
        background:#1a1a2e; color:#fff; padding:14px 22px;
        border-radius:10px; font-family:'DM Sans',sans-serif;
        font-size:0.92rem; font-weight:500;
        box-shadow:0 8px 28px rgba(0,0,0,0.2);
        transform:translateY(100px); opacity:0;
        transition:all 0.35s cubic-bezier(0.4,0,0.2,1);
        display:flex; align-items:center; gap:10px;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `✅ ${msg}`;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 2800);
  }
};

// Init badge on every page
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
